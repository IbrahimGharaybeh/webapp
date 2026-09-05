import { Router } from 'express';
import { auth } from '../auth.js';
import { pool } from '../utils/db.js';
import { isUserInCompany } from '../functions/checkCompanies.js';

const permitTypeMap = {
  person: '/person',
  vehicle: '/vehicle',
  ship: '/ship',
  photography: '/photography',
  '1': '/person',
  '2': '/vehicle',
  '3': '/ship',
  '4': '/photography'
};

function readTokenFromHeaders(req) {
  const headerToken = req.header('x-auth-token');
  if (headerToken) {
    return headerToken.trim();
  }

  const authHeader = req.header('authorization');
  if (!authHeader) {
    return '';
  }

  const [scheme, token] = authHeader.split(/\s+/, 2);
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
    return '';
  }

  return token.trim();
}

async function getSessionByToken(token) {
  const result = await pool.query(
    `SELECT id, "userId", token, "expiresAt"
     FROM "session"
     WHERE token = $1
     LIMIT 1`,
    [token]
  );

  const session = result.rows[0];
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    return null;
  }

  return session;
}

async function getSessionByTokenAnyState(token) {
  const result = await pool.query(
    `SELECT id, "userId", token, "expiresAt"
     FROM "session"
     WHERE token = $1
     LIMIT 1`,
    [token]
  );
  return result.rows[0] ?? null;
}

export default function externalRoutes(dataRouter) {
  const router = Router();

  router.post('/token', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const rememberMe =
      typeof req.body?.rememberMe === 'boolean' ? req.body.rememberMe : true;
    const callbackURL =
      typeof req.body?.callbackURL === 'string' ? req.body.callbackURL : undefined;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    try {
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
          rememberMe,
          callbackURL
        },
        headers: req.headers
      });

      if (!result?.token) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      return res.status(200).json({
        token: result.token,
        user: result.user
      });
    } catch (error) {
      const status = Number(error?.status) || 401;
      const message = error?.message || 'Authentication failed';
      return res.status(status).json({ error: message });
    }
  });

  router.post('/permit', async (req, res, next) => {
    const token = readTokenFromHeaders(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing authentication token header' });
    }

    const rawPermitType = String(req.header('x-permit-type') || '')
      .trim()
      .toLowerCase();
    const targetPath = permitTypeMap[rawPermitType];
    if (!targetPath) {
      return res.status(400).json({
        error: 'Missing or invalid x-permit-type header',
        supported: ['person', 'vehicle', 'ship', 'photography', '1', '2', '3', '4']
      });
    }

    try {
      const session = await getSessionByToken(token);
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Ensure external permit endpoint always returns PDF (frontend final submit behavior).
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        req.body = {};
      }

      const companyId =
        typeof req.body.companyId === 'string' ? req.body.companyId.trim() : '';
      if (!companyId) {
        return res.status(400).json({ error: 'companyId is required' });
      }

      const member = await isUserInCompany(session.userId, companyId);
      if (!member) {
        return res.status(403).json({ error: 'User is not part of this company' });
      }

      req.body.isDraft = false;

      // Pre-authenticate so existing /api/data/* routes run unchanged.
      req.user = { id: session.userId };
      req.session = session;

      const originalUrl = req.url;
      req.url = targetPath;
      return dataRouter.handle(req, res, (error) => {
        req.url = originalUrl;
        if (error) return next(error);
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Failed to route permit request' });
        }
      });
    } catch (error) {
      console.error('External permit processing failed', error);
      return res.status(500).json({ error: 'Failed to process external permit request' });
    }
  });

  router.post('/token/verify', async (req, res) => {
    const token =
      readTokenFromHeaders(req) ||
      (typeof req.body?.token === 'string' ? req.body.token.trim() : '');
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    try {
      const session = await getSessionByTokenAnyState(token);
      if (!session) {
        return res.status(404).json({ valid: false, error: 'Token not found' });
      }

      const expired = new Date(session.expiresAt).getTime() <= Date.now();
      return res.status(200).json({
        valid: !expired,
        expired,
        userId: session.userId,
        expiresAt: session.expiresAt
      });
    } catch (error) {
      console.error('External token verify failed', error);
      return res.status(500).json({ error: 'Failed to verify token' });
    }
  });

  router.post('/token/refresh', async (req, res) => {
    const token =
      readTokenFromHeaders(req) ||
      (typeof req.body?.token === 'string' ? req.body.token.trim() : '');
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    try {
      const session = await getSessionByToken(token);
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const ttlSecondsRaw = Number(process.env.EXTERNAL_TOKEN_TTL_SECONDS ?? 86400);
      const ttlSeconds = Number.isFinite(ttlSecondsRaw) && ttlSecondsRaw > 0
        ? Math.floor(ttlSecondsRaw)
        : 86400;
      const nextExpiry = new Date(Date.now() + ttlSeconds * 1000);

      await pool.query(
        `UPDATE "session"
         SET "expiresAt" = $2
         WHERE token = $1`,
        [token, nextExpiry]
      );

      return res.status(200).json({
        token,
        expiresAt: nextExpiry.toISOString()
      });
    } catch (error) {
      console.error('External token refresh failed', error);
      return res.status(500).json({ error: 'Failed to refresh token' });
    }
  });

  router.post('/token/revoke', async (req, res) => {
    const token =
      readTokenFromHeaders(req) ||
      (typeof req.body?.token === 'string' ? req.body.token.trim() : '');
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    try {
      const deleted = await pool.query(
        `DELETE FROM "session"
         WHERE token = $1`,
        [token]
      );
      if (deleted.rowCount === 0) {
        return res.status(404).json({ error: 'Token not found' });
      }
      return res.status(200).json({ revoked: true });
    } catch (error) {
      console.error('External token revoke failed', error);
      return res.status(500).json({ error: 'Failed to revoke token' });
    }
  });

  return router;
}
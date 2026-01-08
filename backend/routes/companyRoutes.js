import { Router } from 'express';
import { checkCompanies, checkCompaniesAdmin } from '../functions/checkCompanies.js';
import { makeCompany } from '../functions/makeCompany.js';
import { inviteMember, removeMember } from '../functions/companyMemberControls.js';
import { checkAdmin } from '../functions/checkAdmin.js';
import { pool } from '../utils/db.js';

const isUuid = (value) => typeof value === 'string' && /^[0-9a-fA-F-]{36}$/.test(value);

export default function companyRoutes() {
  const router = Router();

  router.post('/makeCompany', async (req, res) => {
    try {
      const userId = req.body.userId;
      const name = req.body.name;
      const code = req.body.code;
      const rows = await makeCompany(userId, name, code);
      res.json(rows);
    } catch (error) {
      console.error('makeCompany failed', error);
      res.status(500).json({ error: 'Failed to create company' });
    }
  });

  router.post('/companyCheck', async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      if (!isUuid(userId)) return res.status(400).json({ error: 'userId must be a UUID' });
      const rows = await checkCompanies(userId);
      res.json(rows);
    } catch (err) {
      console.error('companyCheck failed', err);
      res.status(500).json({ error: 'Failed to check companies', details: err.message });
    }
  });

  router.post('/companyCheckAdmin', async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      if (!isUuid(userId)) return res.status(400).json({ error: 'userId must be a UUID' });
      const rows = await checkCompaniesAdmin(userId);
      res.json(rows);
    } catch (err) {
      console.error('companyCheckAdmin failed', err);
      res.status(500).json({ error: 'Failed to check companies for admin', details: err.message });
    }
  });

  router.post('/companyRepresentatives', async (req, res) => {
    try {
      const adminId = req.body.adminId;
      const companyId = req.body.companyId;
      if (!adminId || !companyId) {
        return res.status(400).json({ error: 'adminId and companyId are required' });
      }
      if (![adminId, companyId].every(isUuid)) {
        return res.status(400).json({ error: 'adminId and companyId must be UUIDs' });
      }

      const isAdmin = await checkAdmin(adminId, companyId);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Authorization denied' });
      }

      const result = await pool.query(
        `select u.id, u.name, u.username, u.email, cr.is_admin
         from company_rep cr
         join users u on u.id = cr.rep
         where cr.company = $1
         order by u.name nulls last, u.email`,
        [companyId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error('companyRepresentatives failed', err);
      res.status(500).json({ error: 'Failed to load representatives', details: err.message });
    }
  });

  router.post('/companyMemberControls/inviteMember', async (req, res) => {
    try {
      const admin = req.body.admin;
      const user = req.body.user;
      const company = req.body.company;
      if (!admin || !user || !company) {
        return res.status(400).json({ error: 'admin, user, and company are required' });
      }
      if (![admin, user, company].every(isUuid)) {
        return res.status(400).json({ error: 'admin, user, and company must be UUIDs' });
      }
      const rows = await inviteMember(user, admin, company);
      res.json(rows);
    } catch (error) {
      console.error('inviteMember failed', error);
      const status = error.status || 500;
      res.status(status).json({ error: 'Failed to invite member', details: error.message });
    }
  });

  router.post('/companyMemberControls/removeMember', async (req, res) => {
    try {
      const admin = req.body.admin;
      const user = req.body.user;
      const company = req.body.company;
      if (!admin || !user || !company) {
        return res.status(400).json({ error: 'admin, user, and company are required' });
      }
      if (![admin, user, company].every(isUuid)) {
        return res.status(400).json({ error: 'admin, user, and company must be UUIDs' });
      }
      const exclusion = await removeMember(user, admin, company);
      res.json(exclusion);
    } catch (error) {
      console.error('removeMember failed', error);
      const status = error.status || 500;
      res.status(status).json({ error: 'Failed to remove member', details: error.message });
    }
  });

  return router;
}

import { auth } from '../auth.js';

export async function requireAuth(req, res, next) {
  if (req.user?.id) {
    return next();
  }

  const session = await auth.api.getSession({ headers: req.headers });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.user = session.user;
  req.session = session.session;
  next();
}

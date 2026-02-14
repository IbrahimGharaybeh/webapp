import { Router } from 'express';
import { deleteUserById } from '../functions/devUserControls.js';

const router = Router();

router.post('/delete-user/:userId', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }

  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const result = await deleteUserById(userId);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({ ok: true, deletedFrom: result.deletedFrom });
});

export default router;

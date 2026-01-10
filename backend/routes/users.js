import { Router } from 'express';
import { randomUUID } from 'crypto';
import { getRepresentativeName } from '../functions/representativeLookup.js';

export default function(pool) {
  const router = Router();

  router.post('/check', async (req, res) => {
    const { username, email } = req.body;
    
    try {
      const result = await pool.query(
        'SELECT id FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );
      
      if (result.rows.length > 0) {
        return res.json({ available: false, error: 'Username or email already taken' });
      }
      
      res.json({ available: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ available: false, error: 'Server error' });
    }
  });

  router.post('/signup', async (req, res) => {
        const { id, email, username, name } = req.body;
        console.log('Received ID:', id);  // Add this
        console.log('ID type:', typeof id);  // Add this
        try {
            await pool.query(
            'INSERT INTO users (id, email, username, name) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
            [id, email, username, name]
            );
            res.status(201).json({ message: 'User created' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create user' });
        }
        });

  router.post('/representative-name', async (req, res) => {
    try {
      const repId = req.body.repId;
      console.log('[representative-name] request', { repId });
      if (!repId) {
        console.log('[representative-name] missing repId');
        return res.status(400).json({ error: 'repId is required' });
      }

      const name = await getRepresentativeName(repId);
      console.log('[representative-name] response', { repId, name });
      return res.json({ name });
    } catch (error) {
      console.error('representative-name failed', error);
      res.status(500).json({ error: 'Failed to load representative name' });
    }
  });

  return router;
}

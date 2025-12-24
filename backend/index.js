import express from 'express';
import cors from 'cors';
import {auth} from './auth.js'
import {toNodeHandler} from 'better-auth/node'
import fillRoutes from './routes/fill.js';
import dataRoutes from './routes/data.js';
import { pool } from './utils/db.js';
import {limiter, authLimiter} from './utils/ratelimiter.js';
import helmet from 'helmet';
import userRoutes from './routes/users.js'

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//security:
//limits found in utils/ratelimiter.js
//general limiter to all routes
app.use(limiter);
//stricter api limiter
app.use('/api/auth', authLimiter)
//helmet
app.use(helmet());

app.get('/', (req, res) => res.json({ message: 'API running' }));
app.all('/api/auth/*path', toNodeHandler(auth)); //auth
app.use('/api/fill', fillRoutes);
app.use('/api/data', dataRoutes(pool));  // No supabase


app.use('/api/users', userRoutes(pool));

app.post('/api/users/signup', async (req, res) => {
  const { id, email, username, name, is_company } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (id, email, username, name, is_company) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [id, email, username, name, is_company]
    );
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'));
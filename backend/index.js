import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import fillRoutes from './routes/fill.js';
import dataRoutes from './routes/data.js';
import companyRoutes from './routes/companyRoutes.js';
import { pool } from './utils/db.js';
import { limiter, authLimiter, externalTokenLimiter } from './utils/ratelimiter.js';
import helmet from 'helmet';
import userRoutes from './routes/users.js';
import devRoutes from './routes/dev.js';
import externalRoutes from './routes/external.js';

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
// general limiter to all routes
app.use(limiter);
// stricter api limiter for auth endpoints
app.use('/api/auth', authLimiter);
// stricter limiter for external token and token lifecycle endpoints
app.use('/api/external/token', externalTokenLimiter);
// security headers
app.use(helmet());

app.get('/', (req, res) => res.json({ message: 'API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/fill', fillRoutes);
const dataRouter = dataRoutes(pool);
app.use('/api/data', dataRouter);  // No supabase
app.use('/api/members/', companyRoutes());
app.use('/api/users', userRoutes(pool));
app.use('/api/dev', devRoutes);
app.use('/api/external', externalRoutes(dataRouter));

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


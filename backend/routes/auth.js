import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../lib/auth.js';

const router = Router();

// Pipe all /api/auth/* traffic through BetterAuth's Node handler.
router.use(toNodeHandler(auth));

export default router;

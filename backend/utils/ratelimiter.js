import {rateLimit} from 'express-rate-limit'

// General limiter - 100 requests per 15 minutes
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: 'Too many requests, try again later' }
});

// Stricter limiter for auth - 10 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn('[authLimiter] blocked request', {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method
    });
    res.status(429).json({ error: 'Too many login attempts, try again later' });
  }
});

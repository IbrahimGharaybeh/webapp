import { afterAll, describe, expect, test, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import fillRoutes from '../routes/fill.js';
import userRoutes from '../routes/users.js';
import { pool as authPool } from '../utils/db.js';

function buildApp(poolMock) {
  const app = express();
  app.use(express.json());
  app.use('/api/fill', fillRoutes);
  app.use('/api/users', userRoutes(poolMock));
  return app;
}

afterAll(async () => {
  await authPool.end();
});

describe('route authentication', () => {
  test.each(['person', 'vehicle', 'ship', 'photography'])(
    'POST /api/fill/%s rejects unauthenticated requests',
    async (endpoint) => {
      const app = buildApp({ query: vi.fn() });

      const response = await request(app)
        .post(`/api/fill/${endpoint}`)
        .send({});

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    }
  );

  test('POST /api/users/representative-name rejects unauthenticated requests', async () => {
    const app = buildApp({ query: vi.fn() });

    const response = await request(app)
      .post('/api/users/representative-name')
      .send({ repId: '00000000-0000-0000-0000-000000000000' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
});

describe('POST /api/users/check', () => {
  test('returns available when the username and email do not exist', async () => {
    const poolMock = {
      query: vi.fn().mockResolvedValue({ rows: [] })
    };
    const app = buildApp(poolMock);

    const response = await request(app)
      .post('/api/users/check')
      .send({ username: 'new-user', email: 'new@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ available: true });
    expect(poolMock.query).toHaveBeenCalledOnce();
    expect(poolMock.query).toHaveBeenCalledWith(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      ['new-user', 'new@example.com']
    );
  });

  test('returns unavailable when the username or email exists', async () => {
    const poolMock = {
      query: vi.fn().mockResolvedValue({ rows: [{ id: 'existing-user-id' }] })
    };
    const app = buildApp(poolMock);

    const response = await request(app)
      .post('/api/users/check')
      .send({ username: 'taken-user', email: 'taken@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      available: false,
      error: 'Username or email already taken'
    });
  });
});

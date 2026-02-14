import assert from 'node:assert/strict';
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

let failures = 0;

async function run(name, fn) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`not ok - ${name}`);
    console.error(error);
  }
}

await run('private fill routes reject unauthenticated requests', async () => {
  const app = buildApp({ query: async () => ({ rows: [] }) });
  const endpoints = ['person', 'vehicle', 'ship', 'photography'];

  for (const endpoint of endpoints) {
    const response = await request(app)
      .post(`/api/fill/${endpoint}`)
      .send({});

    assert.equal(response.status, 401, `Expected 401 for /api/fill/${endpoint}`);
    assert.equal(response.body.error, 'Unauthorized');
  }
});

await run('users representative-name rejects unauthenticated requests', async () => {
  const app = buildApp({ query: async () => ({ rows: [] }) });

  const response = await request(app)
    .post('/api/users/representative-name')
    .send({ repId: '00000000-0000-0000-0000-000000000000' });

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Unauthorized');
});

await run('users check remains public and validates availability', async () => {
  const calls = [];
  const poolMock = {
    query: async (sql, params) => {
      calls.push({ sql, params });
      return { rows: [] };
    }
  };
  const app = buildApp(poolMock);

  const response = await request(app)
    .post('/api/users/check')
    .send({ username: 'new-user', email: 'new@example.com' });

  assert.equal(response.status, 200);
  assert.equal(response.body.available, true);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].params, ['new-user', 'new@example.com']);
});

await run('users check returns unavailable when username/email exists', async () => {
  const poolMock = {
    query: async () => ({ rows: [{ id: 'existing-user-id' }] })
  };
  const app = buildApp(poolMock);

  const response = await request(app)
    .post('/api/users/check')
    .send({ username: 'taken-user', email: 'taken@example.com' });

  assert.equal(response.status, 200);
  assert.equal(response.body.available, false);
  assert.equal(response.body.error, 'Username or email already taken');
});

await authPool.end();

if (failures > 0) {
  process.exit(1);
}

console.log('all integration checks passed');

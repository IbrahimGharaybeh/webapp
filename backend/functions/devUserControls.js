import { pool } from '../utils/db.js';

const isUuid = (value) => typeof value === 'string' && /^[0-9a-fA-F-]{36}$/.test(value);

const dependencyDeletes = [
  { reg: 'public.company_rep', name: 'company_rep', sql: 'DELETE FROM company_rep WHERE rep = $1 OR invited_by = $1' },
  { reg: 'public.company_representative_index', name: 'company_representative_index', sql: 'DELETE FROM company_representative_index WHERE user_id = $1 OR rep = $1' },
  { reg: 'public.permit_representative_index', name: 'permit_representative_index', sql: 'DELETE FROM permit_representative_index WHERE rep = $1' },
  { reg: 'public.person_permits', name: 'person_permits', sql: 'DELETE FROM person_permits WHERE user_id = $1' },
  { reg: 'public.ship_permits', name: 'ship_permits', sql: 'DELETE FROM ship_permits WHERE user_id = $1' },
  { reg: 'public.photography_permits', name: 'photography_permits', sql: 'DELETE FROM photography_permits WHERE user_id = $1' },
  { reg: 'public.vehicle_permits', name: 'vehicle_permits', sql: 'DELETE FROM vehicle_permits WHERE user_id = $1' }
];

const tableMap = [
  { reg: 'public.users', name: 'users', sql: 'DELETE FROM users WHERE id = $1' },
  { reg: 'public.user', name: 'user', sql: 'DELETE FROM "user" WHERE id = $1' }
];

export async function deleteUserById(userId) {
  if (!isUuid(userId)) {
    return { ok: false, error: 'userId must be a UUID' };
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const deletedFrom = [];
    for (const table of dependencyDeletes) {
      const exists = await client.query('SELECT to_regclass($1) AS tbl', [table.reg]);
      if (exists.rows[0]?.tbl) {
        await client.query(table.sql, [userId]);
        deletedFrom.push(table.name);
      }
    }

    for (const table of tableMap) {
      const exists = await client.query('SELECT to_regclass($1) AS tbl', [table.reg]);
      if (exists.rows[0]?.tbl) {
        await client.query(table.sql, [userId]);
        deletedFrom.push(table.name);
      }
    }

    await client.query('COMMIT');
    return { ok: true, deletedFrom };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('deleteUserById failed', error);
    return { ok: false, error: 'Failed to delete user' };
  } finally {
    client.release();
  }
}

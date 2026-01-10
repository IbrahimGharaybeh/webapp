import { pool } from '../utils/db.js';

const isUuid = (value) => typeof value === 'string' && /^[0-9a-fA-F-]{36}$/.test(value);

export async function getRepresentativeName(repId) {
  console.log('[representativeLookup] start', { repId });
  if (!isUuid(repId)) {
    console.log('[representativeLookup] invalid uuid', { repId });
    return null;
  }

  const result = await pool.query(
    'select name, username, email from users where id = $1',
    [repId]
  );
  console.log('[representativeLookup] query result count', { repId, count: result.rows.length });

  const row = result.rows[0];
  if (!row) {
    console.log('[representativeLookup] no user found', { repId });
    return null;
  }

  const name = row.name || row.username || row.email || null;
  console.log('[representativeLookup] resolved', { repId, name });
  return name;
}

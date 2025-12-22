import pkg from 'pg';
const {Pool} = pkg;

export const pool = new Pool({
  host: 'db',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'password',
  max: 20,                        // Max connections
  idleTimeoutMillis: 30000,       // Close idle connections after 30s
  connectionTimeoutMillis: 5000   // Fail if can't connect in 5s
});

export async function getCompanyName(pool, companyId) {
  const result = await pool.query(
    `SELECT name FROM users WHERE id = $1 AND is_company = true`,
    [companyId]
  );
  return result.rows[0]?.name || null;
}

export async function verifyCompanyOwnership(pool, companyId, userId) {
  const result = await pool.query(
    `SELECT 1 FROM company_representative_index 
     WHERE company_id = $1 AND user_id = $2`,
    [companyId, userId]
  );
  return result.rows.length > 0;
}
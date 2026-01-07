import pkg from 'pg';
const { Pool } = pkg;

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'password',
  DB_NAME = 'postgres'
} = process.env;

export const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});



//everything below this is obsolete
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

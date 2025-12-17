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
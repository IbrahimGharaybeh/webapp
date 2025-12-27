import { pool } from "../utils/db.js";

async function indexingCompany(createdBy, companyId) {
  console.log("indexingCompany called with:", { createdBy, companyId });

  const rows = await pool.query(
    `INSERT INTO company_rep (company, rep, is_admin)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [companyId, createdBy, true]
  );

  console.log("indexingCompany pool.query result:", rows);
  console.log("indexingCompany returning rows.rows:", rows.rows);
  return rows.rows;
}

export async function makeCompany(userId, name) {
  console.log("makeCompany called with:", { userId, name });

  const rows = await pool.query(
    `INSERT INTO company (name, created_by)
     VALUES ($1, $2)
     RETURNING *`,
    [name, userId]
  );

  console.log("makeCompany pool.query result:", rows);
  console.log("makeCompany rows.rows:", rows.rows);

  try {
    console.log(
      "attempting to call indexingCompany with:",
      { userId, companyId: rows.rows[0]?.companyId }
    );
  } catch (e) {
    console.log("error accessing rows.rows[0].companyId:", e);
  }
  
  const index = await indexingCompany(userId, rows.rows[0].company_id);  
  console.log("indexingCompany returned:", index);

  console.log("makeCompany returning rows.rows:", rows.rows);
  return rows.rows;
}
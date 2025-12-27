import { pool } from "../utils/db.js";

export async function checkAdmin(user, company) {
    const check = await pool.query(
        `select * from company_rep where rep=$1 and company=$2`,
        [user, company]
    )
    if (check.rows[0] == null) return null;
    return check.rows[0].is_admin;
}
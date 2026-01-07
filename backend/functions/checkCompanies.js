import { pool } from "../utils/db.js"; //always make sure pool is imported, wasted much time on this
//for companies page
//checks all companies the user is a part of
export async function checkCompanies(userId) {
    try {
    console.log('userid recieved: ', userId);
    const result = await pool.query(
        `select cr.company, c.name
         from company_rep cr
         join company c on c.company_id = cr.company
         where cr.rep=$1`,
        [userId]
    )
    console.log("THE RESULT: ", result);
    return result.rows;
} catch (err) {
    throw err;
}
}
//checks companies the user is or isn't an admin of depending on boolean admin
export async function checkCompaniesAdmin(userId) {
    const result = await pool.query(
        `select cr.company, c.name
         from company_rep cr
         join company c on c.company_id = cr.company
         where cr.rep=$1 and cr.is_admin=$2`,
        [userId, true]
    )
    return result.rows;
}

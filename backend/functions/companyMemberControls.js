import { pool } from "../utils/db.js";
import { checkAdmin } from "./checkAdmin.js";

//these need check for admin

export async function inviteMember(user, admin, company, response=true) {
    //gonna keep response true for now, must change later
    if (!await checkAdmin(admin, company)) throw new Error('Authorization denied')
    if (response) {
        const invitation = await pool.query(
            `insert into company_rep (rep, company, is_admin, invited_by)
            values ($1, $2, $3, $4)
            RETURNING *`,
            [user, company, false, admin]
        )
        return invitation.rows;
    } else throw new Error ("Declined by user");
}

export async function kickMember(user, admin, company) {
    if (!await checkAdmin(admin, company)) throw new Error('Authorization denied')
    const exclusion = await pool.query(
        `delete from company_rep where rep = $1 and company = $2`,
        [user, company]
    )
    return exclusion.rowCount;
}
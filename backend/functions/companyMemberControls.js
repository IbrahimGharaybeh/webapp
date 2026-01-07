import { pool } from "../utils/db.js";
import { checkAdmin } from "./checkAdmin.js";

class HttpError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

//these need check for admin

export async function inviteMember(user, admin, company, response=true) {
    //gonna keep response true for now, must change later
    if (!await checkAdmin(admin, company)) throw new HttpError('Authorization denied', 403);
    if (response) {
        try {
            const invitation = await pool.query(
                `insert into company_rep (rep, company, is_admin, invited_by)
                values ($1, $2, $3, $4)
                on conflict (rep, company) do nothing
                RETURNING *`,
                [user, company, false, admin]
            );
            if (invitation.rowCount === 0) {
                throw new HttpError('User is already a member of this company', 409);
            }
            return invitation.rows;
        } catch (err) {
            // surface pg UUID parse issues cleanly
            if (err.code === '22P02') {
                throw new HttpError('Invalid UUID supplied', 400);
            }
            throw err;
        }
    } else throw new HttpError("Declined by user", 400);
}

export async function removeMember(user, admin, company) {
    if (user === admin) throw new HttpError('Admins cannot remove themselves', 400);
    if (!await checkAdmin(admin, company)) throw new HttpError('Authorization denied', 403);
    const exclusion = await pool.query(
        `delete from company_rep where rep = $1 and company = $2`,
        [user, company]
    )
    return exclusion.rowCount;
}

import { betterAuth } from "better-auth";
import { pool } from "./utils/db.js";
import { randomUUID } from "crypto";

export const auth = betterAuth({
    database: pool,
    trustedOrigins: ['http://localhost:5173'],
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        database: {
            generateId: () => {
                const id = randomUUID();
                console.log('GENERATED ID:', id);
                return id;
            }
        }
    }
})
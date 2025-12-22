import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        host: 'db',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'password',
        max: 20,                        // Max connections
        idleTimeoutMillis: 30000,       // Close idle connections after 30s
        connectionTimeoutMillis: 5000   // Fail if can't connect in 5s
    }),
})
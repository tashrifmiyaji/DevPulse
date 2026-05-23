import { Pool } from "pg";
import dotEnv from "../config/dotEnv";

export const pool = new Pool({
	connectionString: dotEnv.dbUrl,
});

export const initDb = async () => {
	try {
            await pool.query(`
                  CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        name TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor','maintainer')),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                  );
            `);

            await pool.query(`
                  CREATE TABLE IF NOT EXISTS issues (
                        id SERIAL PRIMARY KEY,
                        reporter_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                        title VARCHAR(150) NOT NULL,
                        description TEXT NOT NULL,
                        type VARCHAR(20) NOT NULL CHECK (type IN ('bug','feature_request')),
                        status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                  );
            `);

            console.log("database connected successfully");
	} catch (error) {
		console.error(error);
	}
};

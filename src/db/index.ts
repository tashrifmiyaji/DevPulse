import { Pool } from "pg";
import dotEnv from "../config/dotEnv";

export const pool = new Pool({
	connectionString: dotEnv.dbUrl,
});

export const initDb = async () => {
	try {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            role VARCHAR(10) DEFAULT 'contributor',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);

		await pool.query(`
                CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                reporter_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

                title VARCHAR(30),
                description VARCHAR(30),
                type VARCHAR(15),
                status VARCHAR(15),

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                )
                `);
		console.log("database connect successfully");
	} catch (error) {
		console.error(error);
	}
};

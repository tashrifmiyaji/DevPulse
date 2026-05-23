import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const SALT_ROUNDS = 10; // within 8-12 as required

const createUserIntoDB = async (payload: IUser) => {
	const { name, email, password, role } = payload;

	if (!name || !email || !password) {
		throw new Error("name, email and password are required");
	}

	const existing = await pool.query(`SELECT id FROM users WHERE email=$1`, [email]);
	if (existing.rows.length) {
		throw new Error("Email already in use");
	}

	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	const result = await pool.query(
		`INSERT INTO users(name, email, password, role) VALUES($1,$2,$3, COALESCE(NULLIF($4,''),'contributor')) RETURNING id, name, email, role, created_at, updated_at`,
		[name, email, hashedPassword, role],
	);
	return result.rows[0];
};

const loginUserIntoDB = async (payload: { email: string; password: string }) => {
	const { email, password } = payload;

	const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
	if (userData.rows.length === 0) {
		throw new Error("Invalid Credentials!");
	}

	const user = userData.rows[0];
	const matchPassword = await bcrypt.compare(password, user.password);

	if (!matchPassword) {
		throw new Error("Invalid Credentials!");
	}

	delete user.password;
	return user;
};

export const userService = {
	createUserIntoDB,
	loginUserIntoDB,
};

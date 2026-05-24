import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotEnv from "../config/dotEnv";
import { pool } from "../db";
import type { ROLES } from "../types/index";

const auth = (...roles: ROLES[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let token = req.headers.authorization;

			if (!token) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized access",
				});
			}

			if (token.startsWith("Bearer ")) {
				token = token.split(" ")[1];
			}

			const decoded = jwt.verify(token as string, dotEnv.accessTokenSecret as string) as JwtPayload;

			const userId = decoded.id;
			const userData = await pool.query(`SELECT id, name, email, role FROM users WHERE id=$1`, [userId]);
			const user = userData.rows[0];

			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}

			if (roles.length && !roles.includes(user.role)) {
				return res.status(403).json({
					success: false,
					message: "Forbidden: role has no access",
				});
			}

			req.user = {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			} as JwtPayload;

			return next();
		} catch (error) {
			if (
				error instanceof jwt.TokenExpiredError ||
				error instanceof jwt.JsonWebTokenError
			) {
				return next({
					status: 401,
					message:
						error instanceof jwt.TokenExpiredError
							? "Token expired"
							: "Invalid token"
				});
			}

			next(error);
		}
	};
};

export default auth;

import jwt from "jsonwebtoken";
import dotEnv from "../config/dotEnv";

export const getAccessToken = (user) => {
	const jwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwt.sign(
		jwtPayload,
		dotEnv.accessTokenSecret as string,
		{
			expiresIn: "1d",
		},
	);
	return { accessToken };
};

export const getRefreshToken = (user) => {
	const jwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const refreshToken = jwt.sign(
		jwtPayload,
		dotEnv.accessTokenSecret as string,
		{
			expiresIn: "7d",
		},
	);
	return { refreshToken };
};

import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
import { getAccessToken, getRefreshToken } from "../../utility/token";

const createUser = async (req: Request, res: Response) => {
	try {
		const result = await userService.createUserIntoDB(req.body);
		delete result.rows[0].password;

		const refreshToken = getRefreshToken(result);
		res.cookie("refreshToken", refreshToken, {
			secure: false, //todo in production => true
			httpOnly: true,
			sameSite: "lax",
		});

		const accessToken = getAccessToken(result);
		res.header("Authorization", accessToken);

		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "user created successfully.",
			data: result.rows[0],
		});
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			data: error,
		});
	}
};

const loginUser = async (req: Request, res: Response) => {
	try {
		const result = await userService.loginUserIntoDB(req.body);

		const refreshToken = getRefreshToken(result);
		res.cookie("refreshToken", refreshToken, {
			secure: false, //todo in production => true
			httpOnly: true,
			sameSite: "lax",
		});

		const accessToken = getAccessToken(result);
		res.header("Authorization", accessToken);

		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "User retrieved successfully.",
			data: result.rows[0],
		});
	
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			data: error,
		});
	}
};

export const userController = {
	createUser,
	loginUser,
};

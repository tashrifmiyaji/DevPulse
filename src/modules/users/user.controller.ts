import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
import { getAccessToken } from "../../utility/token";

const createUser = async (req: Request, res: Response) => {
	try {
		const user = await userService.createUserIntoDB(req.body);

		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "User registered successfully",
			data: user,
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
		const user = await userService.loginUserIntoDB(req.body);

		const token = getAccessToken(user as any);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Login successful",
			data: {
				token,
				user,
			},
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

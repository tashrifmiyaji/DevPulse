import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

const createIssues = async (req: Request, res: Response) => {
	const result = await issuesService.createIssuesIntoDb(req.body, req.user);
	try {
		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: " issues created",
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
const getAllIssues = async () => {
	
};
const getSingleIssues = async (req: Request, res: Response) => {

};

const updateIssues = async () => {};
const deleteIssues = async () => {
};

export const issuesController = {
	createIssues,
	getAllIssues,
	getSingleIssues,
	updateIssues,
	deleteIssues,
};

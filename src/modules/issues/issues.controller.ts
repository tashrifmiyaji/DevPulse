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
const getAllIssues = async (req: Request, res: Response) => {
	const result = await issuesService.getAllIssuesFromDb(req);
	try {
		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "issues retrieve successfully",
			data: result,
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

const getSingleIssues = async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await issuesService.getSingleIssuesFromDb(id as string);
	try {
		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "issue not found!",
			});
		}

		res.status(200).json({
			success: true,
			message: "issue retrieve successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
			error: error,
		});
	}
};

const updateIssues = async () => {};
const deleteIssues = async () => {};

export const issuesController = {
	createIssues,
	getAllIssues,
	getSingleIssues,
	updateIssues,
	deleteIssues,
};

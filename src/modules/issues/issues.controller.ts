import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

const createIssues = async (req: Request, res: Response) => {
	try {
		const result = await issuesService.createIssuesIntoDb(req.body, req.user);
		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "Issue created successfully",
			data: result,
		});
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 400,
			success: false,
			message: error.message,
			data: error,
		});
	}
};
const getAllIssues = async (req: Request, res: Response) => {
	try {
		const result = await issuesService.getAllIssuesFromDb(req);
		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Issues retrieved successfully",
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
	try {
		const result = await issuesService.getSingleIssuesFromDb(id as string);
		if (!result) {
			return sendResponse(res, {
				statusCode: 404,
				success: false,
				message: "Issue not found",
				data: {},
			});
		}

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Issue retrieved successfully",
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

const updateIssues = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = req.user as any;
	try {
		const existing = await issuesService.getIssueByIdRaw(id as string);
		if (!existing) {
			return sendResponse(res, {
				statusCode: 404,
				success: false,
				message: "Issue not found",
				data: {},
			});
		}

		if (user.role === "contributor") {
			if (existing.reporter_id !== user.id) {
				return sendResponse(res, {
					statusCode: 403,
					success: false,
					message: "Contributors can only update their own issues",
					data: {},
				});
			}
			if (existing.status !== "open") {
				return sendResponse(res, {
					statusCode: 403,
					success: false,
					message: "Cannot update issue unless status is open",
					data: {},
				});
			}

			const { title, description, type } = req.body;
			const updates: any = {};
			if (title) updates.title = title;
			if (description) updates.description = description;
			if (type) updates.type = type;

			if (Object.keys(updates).length === 0) {
				return sendResponse(res, {
					statusCode: 400,
					success: false,
					message: "No valid fields provided for update",
					data: {},
				});
			}

			await issuesService.updateIssuesIntoDb(id as string, updates);
			const updated = await issuesService.getSingleIssuesFromDb(id as string);
			return sendResponse(res, {
				statusCode: 200,
				success: true,
				message: "Issue updated successfully",
				data: updated,
			});
		}

		if (user.role === "maintainer") {
			const updates = req.body;
			await issuesService.updateIssuesIntoDb(id as string, updates);
			const updated = await issuesService.getSingleIssuesFromDb(id as string);
			return sendResponse(res, {
				statusCode: 200,
				success: true,
				message: "Issue updated successfully",
				data: updated,
			});
		}

		return sendResponse(res, {
			statusCode: 403,
			success: false,
			message: "Unauthorized to update issue",
			data: {},
		});
	} catch (error: any) {
		return sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			data: error,
		});
	}
};

const deleteIssues = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const result = await issuesService.deleteIssuesFromDb(id as string);
		if (result.rowCount === 0) {
			return sendResponse(res, {
				statusCode: 404,
				success: false,
				message: "Issue not found",
				data: {},
			});
		}

		return sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Issue deleted successfully",
			data: {},
		});
	} catch (error: any) {
		return sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			data: error,
		});
	}
};

export const issuesController = {
	createIssues,
	getAllIssues,
	getSingleIssues,
	updateIssues,
	deleteIssues,
};

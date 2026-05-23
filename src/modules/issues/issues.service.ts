import type { Request } from "express";
import { pool } from "../../db";
import type { IIssues } from "./issues.interface";

const createIssuesIntoDb = async (payload: IIssues, user) => {
	const { title, description, type } = payload;

	const result = await pool.query(
		`
            INSERT INTO issues(reporter_id, title,description,type,status) VALUES($1,$2,$3,$4,$5) RETURNING *
        `,
		[user.id, title, description, type, "open"],
	);
	return result;
};

const getAllIssuesFromDb = async (req: Request) => {
    const result = await pool.query(`SELECT * FROM issues`);
    const { sort = "newest", type, status} = req.params;

    let issues = result.rows[0]

    if (type) {
		issues = issues.filter((issue: IIssues) => issue.type === type);
	}

	if (status) {
		issues = issues.filter((issue: IIssues) => issue.status === status);
	}

	issues.sort((a, b) => {
		if (sort === "oldest") {
			return new Date(a.createdAt) - new Date(b.createdAt);
		}

		return new Date(b.createdAt) - new Date(a.createdAt);
	});

	return issues;
};

const getSingleIssuesFromDb = async (id: string) => {
	const result = await pool.query(`SELECT * FROM issue WHERE id=$1`, [id]);
	return result;
};

const updateIssuesIntoDb = async () => {};

const deleteIssuesFromDb = async () => {};

export const issuesService = {
	createIssuesIntoDb,
	getAllIssuesFromDb,
	getSingleIssuesFromDb,
	updateIssuesIntoDb,
	deleteIssuesFromDb,
};

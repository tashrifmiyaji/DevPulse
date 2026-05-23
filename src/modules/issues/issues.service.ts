import type { Request } from "express";
import { pool } from "../../db";
import type { IIssues } from "./issues.interface";

type DBIssueRow = {
	id: number;
	reporter_id: number;
	title: string;
	description: string;
	type: string;
	status: string;
	created_at: Date;
	updated_at: Date;
};

const createIssuesIntoDb = async (payload: IIssues, user: any) => {
	const { title, description, type } = payload;

	if (!title || title.length > 150) {
		throw new Error("Title is required and must be 150 characters or fewer");
	}
	if (!description || description.length < 20) {
		throw new Error("Description is required and must be at least 20 characters");
	}
	if (!["bug", "feature_request"].includes(type)) {
		throw new Error("Type must be 'bug' or 'feature_request'");
	}

	const result = await pool.query(
		`INSERT INTO issues(reporter_id, title, description, type, status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
		[user.id, title, description, type, "open"],
	);

	return result.rows[0];
};

const getAllIssuesFromDb = async (req: Request) => {
	const q = req.query as any;
	const sort = (q.sort as string) || "newest";
	const type = q.type as string | undefined;
	const status = q.status as string | undefined;

	const values: any[] = [];
	const whereClauses: string[] = [];
	if (type) {
		values.push(type);
		whereClauses.push(`type = $${values.length}`);
	}
	if (status) {
		values.push(status);
		whereClauses.push(`status = $${values.length}`);
	}

	const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
	const orderSql = sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";

	const sql = `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues ${whereSql} ${orderSql}`;
	const result = await pool.query(sql, values);

	const issues = result.rows as DBIssueRow[];
	if (issues.length === 0) return [];

	const reporterIds = [...new Set(issues.map((i) => i.reporter_id).filter(Boolean))];
	const reportersMap: Record<number, { id: number; name: string; role: string }> = {};
	if (reporterIds.length) {
		const usersRes = await pool.query(`SELECT id, name, role FROM users WHERE id = ANY($1::int[])`, [reporterIds]);
		usersRes.rows.forEach((u: any) => {
			reportersMap[u.id] = { id: u.id, name: u.name, role: u.role };
		});
	}

	const formatted = issues.map((issue) => ({
		id: issue.id,
		title: issue.title,
		description: issue.description,
		type: issue.type,
		status: issue.status,
		reporter: issue.reporter_id ? reportersMap[issue.reporter_id] || null : null,
		created_at: issue.created_at ? issue.created_at.toISOString() : null,
		updated_at: issue.updated_at ? issue.updated_at.toISOString() : null,
	}));

	return formatted;
};

const getSingleIssuesFromDb = async (id: string) => {
	const result = await pool.query(`SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id=$1`, [id]);
	if (result.rows.length === 0) return null;

	const issue = result.rows[0] as DBIssueRow;
	let reporter = null;
	if (issue.reporter_id) {
		const uRes = await pool.query(`SELECT id, name, role FROM users WHERE id=$1`, [issue.reporter_id]);
		if (uRes.rows.length) {
			const u = uRes.rows[0];
			reporter = { id: u.id, name: u.name, role: u.role };
		}
	}

	return {
		id: issue.id,
		title: issue.title,
		description: issue.description,
		type: issue.type,
		status: issue.status,
		reporter,
		created_at: issue.created_at ? issue.created_at.toISOString() : null,
		updated_at: issue.updated_at ? issue.updated_at.toISOString() : null,
	};
};

const getIssueByIdRaw = async (id: string) => {
	const result = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);
	return result.rows[0] || null;
};

const updateIssuesIntoDb = async (id: string, updates: Partial<IIssues & { status?: string }>) => {
	const allowed = ["title", "description", "type", "status"];
	const setClauses: string[] = [];
	const values: any[] = [];
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			values.push((updates as any)[key]);
			setClauses.push(`${key} = $${values.length}`);
		}
	}
	if (setClauses.length === 0) {
		throw new Error("No valid fields provided for update");
	}

	values.push(id);
	const sql = `UPDATE issues SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`;
	const result = await pool.query(sql, values);
	return result.rows[0];
};

const deleteIssuesFromDb = async (id: string) => {
	const result = await pool.query(`DELETE FROM issues WHERE id=$1`, [id]);
	return result;
};

export const issuesService = {
	createIssuesIntoDb,
	getAllIssuesFromDb,
	getSingleIssuesFromDb,
	updateIssuesIntoDb,
	deleteIssuesFromDb,
	getIssueByIdRaw,
};

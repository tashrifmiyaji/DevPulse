import app from "./app";
import dotEnv from "./config/dotEnv";
import { initDb } from "./db";

const main = () => {
	initDb()
	app.listen(dotEnv.port, () => {
		console.log(`express app listing on http://localhost:${dotEnv.port}`);
	});
};
main()
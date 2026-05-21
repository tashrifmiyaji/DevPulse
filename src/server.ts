import app from "./app";
import dotEnv from "./config/dotEnv";

const main = () => {
	app.listen(dotEnv.port, () => {
		console.log(`express app listing on http://localhost:${dotEnv.port}`);
	});
};
main()
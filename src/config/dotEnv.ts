import { config } from "dotenv";
import path from "path";
config({
	path: path.join(process.cwd(), ".env"),
});

const dotEnv = {
	port: process.env.PORT,
	dbUrl: process.env.CONNECTION_STRING,
	accessTokenSecret: process.env.JWT_ACCESS_SECRET,
	refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
};

export default dotEnv;
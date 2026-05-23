// external imports
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import userRouter from "./modules/users/user.route";
import issuesRouter from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "hello world!",
	});
});

// route
app.use("/api/auth", userRouter);
app.use("/api/issues", issuesRouter);

// error
app.use(globalErrorHandler)

export default app;

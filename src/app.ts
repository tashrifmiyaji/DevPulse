// external imports
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import  userRouter  from "./modules/users/user.route";

const app: Application = express();

// route
app.use("/api/auth",userRouter)

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "hello world!",
	});
});

export default app;

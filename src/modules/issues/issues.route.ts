import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

router.post(
	"/",
	auth(USER_ROLE.maintainer, USER_ROLE.contributor),
	issuesController.createIssues,
);
router.get("/", auth(USER_ROLE.maintainer), issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssues);
router.patch("/:id", issuesController.updateIssues);
router.delete("/:id", issuesController.deleteIssues);

export default router;

import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

router.get("/", UserController.getAuthenticatedData);
router.get("/others/:id", UserController.getOthersData)

export default router;

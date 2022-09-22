import { Router } from "express";
import ChatController from "../controllers/chat.controller";

const router = Router();

router.get("/authenticate", ChatController.getWebsocketToken);

export default router;

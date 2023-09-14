import express from "express";
import protect from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

const initMessageRoutes = (app) => {
    router.post("/", protect, sendMessage);
    router.get("/:chatId", protect, allMessages); // fetch tất cả message từ 1 chat

    return app.use("/api/message", router)
}

export default initMessageRoutes;
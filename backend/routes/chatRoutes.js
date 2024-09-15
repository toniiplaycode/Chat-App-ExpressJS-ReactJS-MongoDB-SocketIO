import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { accessChat, addGroup, createGroup, fetchChats, removeUserFromGroup, renameGroup, deleteChat } from '../controllers/chatController.js';
const router = express.Router();

const initChatRoutes = (app) => {
    router.post("/", protect, accessChat); // chat 1-1, nếu chưa có thì tạo
    router.get("/", protect, fetchChats); // fecth tất cả các chat cho user đang đang nhập
    router.post("/createGroup", protect, createGroup); // tạo 1 group chat với >=3 người, bao gồm user đang đăng nhập
    router.put("/renameGroup", protect, renameGroup);
    router.put("/addGroup", protect, addGroup); // add 1 user vào group
    router.put("/removeUserFromGroup", protect, removeUserFromGroup); // remove 1 user khỏi group
    router.delete("/deleteChat", protect, deleteChat); // xoá 1 chat

    return app.use("/api/chat", router);
}

export default initChatRoutes;
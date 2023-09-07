import express from 'express';
import { registerUser, authUser, allUsers } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// protect là middleware để check xem có uer nào đăng nhập chưa, nếu chưa thì sẽ không cho qua controller để xử lý
const initUserRoutes = (app) => {
    router.post("/signup", registerUser)
    router.post("/login", authUser);
    router.get("/", protect, allUsers);

    return app.use('/api/user', router);
}

export default initUserRoutes

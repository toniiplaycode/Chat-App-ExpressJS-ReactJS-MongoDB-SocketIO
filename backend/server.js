import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { chats } from "./data/data.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import initUserRoutes from "./routes/userRoutes.js";
import initChatRoutes from "./routes/chatRoutes.js";

dotenv.config(); // thêm này để có thể dử dụng được cái biến ở .env
const PORT = process.env.PORT;

connectDB(); // kết nối mongoose atlas

const app = express();

app.use(express.json()); // thêm này mới post được dữ liệu

app.use(cors({origin: true, credentials: true})); // thêm cors thì frontend mới có thể fetch được dữ liệu

initUserRoutes(app);
initChatRoutes(app);

app.listen(PORT, console.log(`server running ${PORT}`.bgBrightGreen));
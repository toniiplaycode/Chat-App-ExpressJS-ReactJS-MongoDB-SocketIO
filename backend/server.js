import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { chats } from "./data/data.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import initUserRoutes from "./routes/userRoutes.js";
import initChatRoutes from "./routes/chatRoutes.js";
import initMessageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config(); // thêm này để có thể dử dụng được cái biến ở .env
const PORT = process.env.PORT;

connectDB(); // kết nối mongoose atlas

const app = express();

app.use(express.json()); // thêm này mới post được dữ liệu

app.use(cors({origin: true, credentials: true})); // thêm cors thì frontend mới có thể fetch được dữ liệu

initUserRoutes(app);
initChatRoutes(app);
initMessageRoutes(app);

const server = http.createServer(app);  // dùng http.createServer để tạo server

const io = new Server(server, {
    pingTimeout: 60000, // trong 60s mà không sử dụng thì nó sẽ disconnected, để tiết kiệm băng thông
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected to soket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);  // mỗi người dùng là 1 room
        socket.emit("connected"); // gọi connected từ giao diện
    });

    socket.on("join chat", (room) => {
        socket.join(room); // tạo room với id của selectedChat được gửi từ giao diện
        console.log("user joined room: ", room);
    });

    socket.on("new message", (newMessageRecieved) => { 
        let chat = newMessageRecieved.chat;
        
        if(!chat.users) {
            console.log("chat.user is not defined");
            return;
        } 

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return; // không gửi tin nhắn cho người gửi
            socket.in(user._id).emit("message recieved", newMessageRecieved); // gửi tin nhắn cho các room 
        });
    })

});

server.listen(PORT, console.log(`server running ${PORT}`.bgBrightGreen))
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";

export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    if(!content || !chatId) {
        console.log("Invalid data passed into request !");
        return res.sendStatus(400);
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        }) 

        // mỗi khi có message mới thì cập nhật lại lastestMessage của chat model
        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastestMessage: message
        })

        res.send(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

// fetch tất cả message từ 1 chat
export const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name pic email")
        .populate("chat")

        res.json(messages);
    } catch (error) {
        res.status(400);z
        throw new Error(error.message);
    }    
}
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

export const accessChat = async (req, res) => {
    const { userId } = req.body;
    
    if(!userId) {
        console.log("userId param not sent with request");
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ],
    }).populate("users", "-password").populate("lastestMessage")

    isChat = await User.populate(isChat, {
        path: "lastestMessage.sender",
        select: "name pic email",
    });

    // giải thích code ở trên (https://chat.openai.com/c/d4c7a2c5-847b-489e-b79a-ad7861858b2d)

    // nếu chưa có chat giữa 2 user thì tạo chat mới
    if(isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        try {
            const createChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password");

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

}

export const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("lastestMessage")
        .sort({updatedAt: -1})
        .then( async (result) => {
            result = await User.populate(result, {
                path: "lastestMessage.sender",
                select: "name pic email"
            });

            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

export const createGroup = async (req, res) => {
    // body có các users và name(tên group) 
    const groupMembers = req.body.users; 
    const groupName = req.body.name;
    
    if(!groupMembers || !groupName) {
        return res.status(400).send({message: "Please fill all the fields"});
    }    

    var users = JSON.parse(req.body.users); 
    users.push(req.user); // thêm user đang đăng nhập 

    try {
        const groupChat = await Chat.create({
            chatName: groupName,
            users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")


        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

export const renameGroup = async (req, res) => {
    const {chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    // tham số thứ 3 findByIdAndUpdate (https://chat.openai.com/c/cfa16034-3383-40b6-baff-a978a68babd3)

    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(updatedChat);
    }
}

export const addGroup = async (req, res) => {
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId},
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(added);
    }
}

export const removeGroup = async (req, res) => {
    const {chatId, userId, changeGroupAdmin} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: userId},
            $set: { groupAdmin: changeGroupAdmin } // đổi admin cho user khác
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")


    if(!removed) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(removed);
    }

}
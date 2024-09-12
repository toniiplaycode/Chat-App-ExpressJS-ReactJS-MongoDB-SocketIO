import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState(); // người dùng hiện tại đang đăng nhập
    const [selectedChat, setSelectedChat] = useState(); // dùng cho route chat 1-1, nếu chưa có thì tạo
    const [chats, setChats] = useState([]); // dùng cho route fecth tất cả các chat cho user đang đang nhập
    const [notification, setNotification] = useState([]); // dùng để thông báo các tin nhắn chưa đọc (chưa selectedChat)
    const [fetchAgain, setFetchAgain] = useState(false); // dùng để fetch lại các chat cho user khi có thay đổi gì đó
    const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false); // dùng để đóng mở emoji picker
    const [isOpenImgPicker, setIsOpenImgPicker] = useState(false); // dùng để đóng mở image picker

    const navigate = useNavigate(); // useNavigate chỉ dùng được khi nằm trong BrowserRouter

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userChatApp"));

        setUser(userInfo);

        if(!userInfo) {
            navigate('/');; // chưa đăng nhập sẽ back lại trang login
        }
    }, [navigate]) // khi nào chuyển route(dependencies navigate thay đổi) thì callback trong useEffect được gọi

    return (
        <ChatContext.Provider value={{
            user, setUser, 
            selectedChat, setSelectedChat, 
            chats, setChats, 
            notification, setNotification, 
            fetchAgain, setFetchAgain, 
            isOpenEmojiPicker, setIsOpenEmojiPicker,
            isOpenImgPicker, setIsOpenImgPicker
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;
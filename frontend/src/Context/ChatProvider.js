import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState(); // người dùng hiện tại đang đăng nhập
    const [selectedChat, setSelectedChat] = useState(); // dùng cho route chat 1-1, nếu chưa có thì tạo
    const [chats, setChats] = useState([]); // dùng cho route fecth tất cả các chat cho user đang đang nhập

    const navigate = useNavigate(); // useNavigate chỉ dùng được khi nằm trong BrowserRouter

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userChatApp"));

        setUser(userInfo);

        if(!userInfo) {
            navigate('/');; // chưa đăng nhập sẽ back lại trang login
        }
    }, [navigate]) // khi nào chuyển route(dependencies navigate thay đổi) thì callback trong useEffect được gọi

    return (
        <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;
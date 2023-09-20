import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons"
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../handleLogic/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styleMessage.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from '../animations/typing_animation.json'

let socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const toast = useToast();

    // defaultOptions này cho typing animation 
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const fetchMessages = async (e) => {
        if(!selectedChat) return;
        
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }    
            }
            const { data } = await axios.get(`http://localhost:8800/api/message/${selectedChat._id}`, config); 

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id); // gọi join chat từ server
        } catch (error) {
            toast({
                title: "Fetch message failed !",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }

    useEffect(() => {
        socket = io.connect("http://localhost:8800");

        socket.emit("setup", user); // gọi setup từ server gửi kèm user đang đăng nhập

        socket.on("connected", () => {
            setSocketConnected(true);
        });
        
        // typing và stop typing này được gọi từ server
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);
    
    useEffect(()=>{
        fetchMessages();    

        selectedChatCompare = selectedChat;
    }, [selectedChat]); // fetchMessages sẽ được gọi lại khi chọn selectedChat 

    // useEffect này sẽ được re-render liên tục khi component thay đổi
    useEffect(()=>{
        // console.log("re-render");
        
        // message recieved này sẽ được gọi khi có user khác gửi tin nhắn
        socket.on("message recieved", (newMessageRecived) => {
            // console.log(newMessageRecived);
            // console.log(notification.includes(newMessageRecived.chat._id));
            // console.log(notification);
            // điều kiện thứ 2 là khi user đang trong tin nhắn thì không cần gửi thông báo 
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecived.chat._id) {
                if(!notification.includes(newMessageRecived)) {
                    setNotification([...notification, newMessageRecived]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecived]);
            }
        });
    });

    // console.log("notification: ", notification);

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage.trim().length > 0) {
            socket.emit("stop typing", selectedChat._id);

            try {
                const config = {
                    headers: {
                        "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                        Authorization: `Bearer ${user.token}`,
                    }    
                }
                
                setNewMessage("");

                const { data } = await axios.post("http://localhost:8800/api/message", 
                {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);          
                
                // console.log(data);

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Send message failed !",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    position: "top-right"
                })
            }
        }
    }

    const typingHandle = (e) => {
        setNewMessage(e.target.value);

        // typing logic
        if(!socketConnected) return;

        if(!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        // sau 3s gõ thì sẽ setTyping lại thành false
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(()=>{
            let timeNow = new Date().getTime();
            let timeDifference = timeNow - lastTypingTime;
            if(timeDifference >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return(
        <>
            {selectedChat
            ? ( <>
                    <Text
                        pb={3}
                        px={2}
                        w={"100%"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <IconButton
                            display={{base: "flex", md: "none"}}
                            icon={<ArrowBackIcon/>}
                            onClick={()=>setSelectedChat(null)} 
                        />

                        {!selectedChat.isGroupChat 
                            ? (
                                <>
                                    <Text 
                                        fontSize={"2xl"}
                                    >
                                        {getSender(user, selectedChat.users)}
                                    </Text>
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                                </>
                            )     
                            : (
                                <>
                                    <Text
                                        fontSize={"2xl"}
                                    >
                                        {selectedChat.chatName}
                                    </Text>
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )       
                        }
                    </Text>

                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        background={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                        { loading 
                        ? (
                            <Spinner size={"xl"} m={"auto"} display={"block"}/>
                        ) 
                        : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )
                        }

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                        >
                            {isTyping 
                            ? 
                                <div>
                                    <Lottie 
                                        options={defaultOptions}
                                        width={70}
                                        style={{
                                            marginTop: 5,
                                            marginBottom: 15,
                                            marginLeft: 0
                                        }}                          
                                    />
                                </div>
                            : 
                                <></>
                            } 
                            <Input
                                background={"#d9d9d9"}
                                placeholder="Enter a message..."
                                value={newMessage}
                                onChange={typingHandle}
                            />
                        </FormControl>
                    </Box>
                </>    
            ) 
            : (
                <Text fontSize={"3xl"} my={"auto"}>
                    Click on a user to start chatting
                </Text>
            ) 
            }
        </>
    )
}

export default SingleChat;
import { Avatar, Box, Button, Flex, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon, ChevronRightIcon, NotAllowedIcon } from "@chakra-ui/icons"
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../../handleLogic/ChatLogic";
import ProfileModal from "../ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../style/styleMessage.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from '../../animations/typing_animation.json'
import EmojiPicker from './EmojiPicker';
import ImgPicker from "./ImgPicker";

let socket, selectedChatCompare;

const SingleChat = () => {
    const { user, selectedChat, setSelectedChat, notification, setNotification, fetchAgain, setFetchAgain, setIsOpenEmojiPicker, setIsOpenImgPicker } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isClickSend, setIsClickSend] = useState(false);

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
                title: "Fetch tin nhắn thất bại",
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

    useEffect(() => {
        //  message recieved này sẽ được gọi khi có user khác gửi tin nhắn
        socket.on("message recieved", (newMessageRecived) => {
            // Kiểm tra message nhận được có phải từ một cuộc trò chuyện khác không
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecived.chat._id) {
                const chatExists = notification.some((n) => n.chat._id === newMessageRecived.chat._id);
    
                // nếu chat đó chưa có trong notification thì mới thêm 
                if (!chatExists) {
                    setNotification([...notification, newMessageRecived]);
                }
                
                recievedNotifyBrowserNewMessage(newMessageRecived);
            } else {
                setMessages([...messages, newMessageRecived]);
            }

            setFetchAgain(!fetchAgain);
        });
    
        // Cleanup
        return () => {
            socket.off("message recieved");
        };
    }, [fetchAgain, messages, socket]);

    const recievedNotifyBrowserNewMessage = (newMessageRecived) => { // hàm nhận thông báo về thiết bị từ browswer, cả 2 room chat phải đều mở mới nhận được thông báo
        Notification.requestPermission().then(perm => {
            if(perm == "granted") {
                if(newMessageRecived.chat.chatName == "sender") {
                    new Notification(newMessageRecived.sender.name, {
                        body: newMessageRecived.content.split(":")[0] === "http" ? "Đã gửi 1 ảnh" : newMessageRecived.content, 
                        icon: newMessageRecived.sender.pic
                    });
                } else {
                    new Notification(newMessageRecived.chat.chatName, {
                        body: newMessageRecived.content.split(":")[0] === "http" ? "Đã gửi 1 ảnh" : newMessageRecived.content, 
                        icon: "group.png"
                    });
                }
            }
        })
    }
    
    const sendMessage = async () => {
        if(newMessage.trim().length > 0) {
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
                
                socket.emit("new message", data);
                setMessages([...messages, data]);
                setIsClickSend(false);

                setFetchAgain(!fetchAgain)
            } catch (error) {
                toast({
                    title: "Gửi tin nhắn thất bại !",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    position: "top-right"
                })
                setIsClickSend(false);

                setFetchAgain(!fetchAgain)
            }
        }
    }

    // nhấn enter để gửi message
    const enterToSend = (e) => {
        if(e.key === "Enter") { 
            sendMessage();
        }
    }

    // nhấn click chuột để gửi message
    useEffect(()=>{
        if(isClickSend) {
            sendMessage();
        }
    }, [isClickSend])

    const typingHandle = (e) => {
        setNewMessage(e.target.value);
        
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

    const handleEmojiSelect = (emoji) => {
        setNewMessage(newMessage + emoji);
    };

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
                                    display={"flex"}
                                >
                                <Avatar
                                    mt={"7px"}
                                    mr={1}
                                    size={"sm"}
                                    border={"1px solid white"}
                                    cursor={"pointer"}
                                    marginY={"auto"}
                                    marginRight={"5px"}
                                    src={getSenderFull(user, selectedChat.users).pic}
                                />
                                    {getSender(user, selectedChat.users)}
                                </Text>
                                <ProfileModal userProfile={getSenderFull(user, selectedChat.users)}/>
                            </>
                        )     
                        : (
                            <>
                                <Text
                                    fontSize={"2xl"}
                                    display={"flex"}
                                >
                                    <Avatar
                                        mt={"7px"}
                                        mr={1}
                                        size={"sm"}
                                        border={"1px solid white"}
                                        cursor={"pointer"}
                                        marginY={"auto"}
                                        marginRight={"5px"}
                                        src={"group.png"}
                                    />
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
                            <div className="messages"
                                onClick={()=>{
                                    setIsOpenEmojiPicker(false);
                                    setIsOpenImgPicker(false);
                                }}
                            >
                                <ScrollableChat messages={messages}/>
                            </div>
                        )
                        }
                        
                        {isTyping 
                        ? 
                            <Box 
                                height={"25px"}
                            >
                                <Lottie 
                                    options={defaultOptions}
                                    width={70}
                                    style={{
                                        marginTop: 5,
                                        marginBottom: 15,
                                        marginLeft: 0,
                                        borderRadius: 10,
                                    }}                          
                                />
                            </Box>
                        : 
                            <></>
                        } 

                        <Box 
                            display={"flex"}
                            paddingTop={"12px"}
                            gap={"5px"}
                        >
                            <Box
                                display={"flex"}
                                alignItems={"center"}
                            >
                                <ImgPicker fetchMessages={fetchMessages}/>
                                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                            </Box>
                            
                            <FormControl
                                onKeyDown={enterToSend}
                                isRequired
                            >
                                <Input
                                    background={"#d9d9d9"}
                                    placeholder="Enter a message..."
                                    value={newMessage}
                                    onChange={typingHandle}
                                    onClick={()=>{
                                        setIsOpenEmojiPicker(false);
                                        setIsOpenImgPicker(false);
                                    }}
                                />

                            </FormControl>

                            <IconButton
                                icon={<ChevronRightIcon boxSize={8}/>}
                                onClick={() => setIsClickSend(true)}
                            />

                        </Box>
                    </Box>
                </>    
            ) 
            : (
                <Text fontSize={"3xl"} my={"auto"}>
                    Hãy bắt đầu cuộc trò chuyện !
                </Text>
            ) 
            }
        </>
    )
}

export default SingleChat;
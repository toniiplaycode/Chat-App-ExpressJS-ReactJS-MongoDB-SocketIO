import { Avatar, Box, Button, Flex, Spinner, Stack, Text, useMediaQuery, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import { countTimeSend, formatTime, getSender, getSenderFull, whoIsSendMessage } from "../../handleLogic/ChatLogic";
import GroupChatModal from "./GroupChatModal";
import { io } from "socket.io-client";

let socket;

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const [loading, setLoading] = useState(false);
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, fetchAgain, setFetchAgain, setIsOpenEmojiPicker, setIsOpenImgPicker } = ChatState();

    const toast = useToast();

    useEffect(() => {
        socket = io.connect("http://localhost:8800");

        socket.emit("setup", user); // gọi setup từ server gửi kèm user đang đăng nhập
    }, []);

    const fetchChats = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }    
            }

            const { data } = await axios.get("http://localhost:8800/api/chat", config)
            setChats(data);
            
        } catch (error) {
            toast({
                title: "Fetch chat thất bại",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }

        setLoading(false);
    }
    
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userChatApp")));
        fetchChats();
    }, [fetchAgain]) // useEffect sẽ được gọi lại khi selectedChat thay đổi
    
    
    useEffect(() => {
        socket.on("fetch chats again", () => {
            1();
        });
    
        // Cleanup
        return () => {
            socket.off("fetch chats again");
        };
    }, [socket]);

    return(
        <Box
            display={{base: selectedChat ? "none" : "flex", md: "flex"}}
            flexDirection={"column"}
            alignItems={"center"}
            p={3}
            bg={"white"}
            w={{base: "100%", md: "500px"}}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Box
                w={"100%"}
                px={"6px"}
                pb={"6px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >   
                <GroupChatModal>
                    <Button>Tạo nhóm +</Button>
                </GroupChatModal>
                <Text fontSize={20}>Đoạn chat</Text>
            </Box>

            <Box
                display={"flex"}
                flexDirection={"column"}
                p={3}
                bg={"#F8F8F8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {(loading && chats.length === 0) && <Spinner size='xl' m={"auto"} display={"block"} mt={"20px"}/>}

                {chats && (
                    <Stack 
                        overflowY={"scroll"}
                    >
                        {chats.map((chat) => (
                            <Box
                                key={chat._id}
                                onClick={() => {
                                    setIsOpenEmojiPicker(false);
                                    setIsOpenImgPicker(false);
                                    setSelectedChat(chat)
                                    setNotification(notification.filter(n => n.chat._id != chat._id));
                                }}
                                cursor="pointer"
                                bg={selectedChat && selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                                px={3}
                                py={3}
                                mr={0.5}
                                borderRadius="lg"
                                display={"flex"}
                                alignItems={"center"}
                                position={"relative"}
                            >   
                            
                                <Avatar
                                    mt={"7px"}
                                    mr={1}
                                    size={"sm"}
                                    border={"1px solid white"}
                                    cursor={"pointer"}
                                    marginY={"auto"}
                                    marginRight={"5px"}
                                    src={chat.chatName == "sender" ? getSenderFull(loggedUser, chat.users).pic : "group.png"}
                                />
                                <Box>
                                    <Text
                                        color={selectedChat && selectedChat._id === chat._id ? "white" : "#333"}                                        
                                        maxWidth={{base: "100px", sm: "250px", md:"180px"}}
                                        overflow={"hidden"}
                                        whiteSpace={"nowrap"}
                                        textOverflow={"ellipsis"}
                                    >
                                        {!chat.isGroupChat 
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName} 
                                    </Text>
                                    {chat.lastestMessage && 
                                    <Text
                                        fontSize={"12px"}                                        
                                        maxWidth={{base: "100px", sm: "250px", md:"160px"}}
                                        overflow={"hidden"}
                                        whiteSpace={"nowrap"}
                                        textOverflow={"ellipsis"}
                                    >
                                        {whoIsSendMessage(chat, loggedUser)}
                                    </Text>
                                    }
                                </Box>
                                {
                                    notification.map((m) => {
                                        if(chat._id == m.chat._id) {
                                            return(
                                                <Box 
                                                    width={"6px"}
                                                    height={"6px"}
                                                    background={"red"}
                                                    borderRadius={"50%"}
                                                    position={"absolute"}
                                                    right={"6px"}
                                                />
                                            )
                                        }
                                    })
                                }
                                <Text
                                    position={"absolute"}
                                    right={"16px"}
                                    fontSize={"12px"}
                                >
                                    {countTimeSend(chat.lastestMessage)} 
                                </Text>            
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>

        </Box>
    )
}

export default MyChats; 
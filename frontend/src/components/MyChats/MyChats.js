import { Avatar, Box, Button, Flex, Stack, Text, useMediaQuery, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { countTimeSend, formatTime, getSender, getSenderFull, whoIsSendMessage } from "../../handleLogic/ChatLogic";
import GroupChatModal from "./GroupChatModal";
import { NotAllowedIcon } from "@chakra-ui/icons";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, fetchAgain, setIsOpenEmojiPicker, setIsOpenImgPicker } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }    
            }

            const { data } = await axios.get("http://localhost:8800/api/chat", config)
            setChats(data);
            
            // console.log("fecth chats: ", data);
        } catch (error) {
            toast({
                title: "Fetch chat thất bại",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }
    
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userChatApp")));
        fetchChats();
    }, [fetchAgain]) // useEffect sẽ được gọi lại khi selectedChat thay đổi


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
                {chats ? (
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
                                    <Text
                                        fontSize={"12px"}                                        
                                        maxWidth={{base: "100px", sm: "250px", md:"160px"}}
                                        overflow={"hidden"}
                                        whiteSpace={"nowrap"}
                                        textOverflow={"ellipsis"}
                                    >
                                        {whoIsSendMessage(chat, loggedUser)}
                                    </Text>
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
                ) : (
                    <ChatLoading/>
                )}
            </Box>

        </Box>
    )
}

export default MyChats; 
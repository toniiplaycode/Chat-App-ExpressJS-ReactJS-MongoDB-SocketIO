import { Avatar, Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { getSender, getSenderFull } from "../../handleLogic/ChatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, fetchAgain } = ChatState();

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
                title: "Fetch chat failed !",
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
            w={{base: "100%", md: "30%"}}
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
                <Text
                    fontSize={"1xl"}
                >
                    My Chats
                </Text>
                
                <GroupChatModal>
                    <Button>New Group Chat +</Button>
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
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => (
                            <Box
                                key={chat._id}
                                onClick={() => {
                                    setSelectedChat(chat)
                                    setNotification(notification.filter(n => n.chat._id != chat._id));
                                }}
                                cursor="pointer"
                                bg={selectedChat && selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                                px={3}
                                py={3}
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
                                <Text
                                    color={selectedChat && selectedChat._id === chat._id ? "white" : "#333"}
                                >
                                    {!chat.isGroupChat 
                                    ? getSender(loggedUser, chat.users)
                                    : chat.chatName} 
                                </Text>
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
                                                    right={"10px"}
                                                />
                                            )
                                        }
                                    })
                                }
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
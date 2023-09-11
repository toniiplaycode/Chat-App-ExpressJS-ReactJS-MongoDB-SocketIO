import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "../handleLogic/ChatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

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
    }, [selectedChat]) // useEffect sẽ được gọi lại khi selectedChat thay đổi

    
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
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >   
                                <Text>
                                    {!chat.isGroupChat 
                                    ? getSender(loggedUser, chat.users)
                                    : chat.chatName} 
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
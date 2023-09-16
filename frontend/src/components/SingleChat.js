import { Box, FormControl, IconButton, Input, Spinner, Text, flattenTokens, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons"
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../handleLogic/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styleMessage.css";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const toast = useToast();

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
    
    useEffect(()=>{
        fetchMessages();
    }, [selectedChat]);

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage.trim().length > 0) {
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
                
                console.log(data);

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

        // handle typing indicator 
        
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
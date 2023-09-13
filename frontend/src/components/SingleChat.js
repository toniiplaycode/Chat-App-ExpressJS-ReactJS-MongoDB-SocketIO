import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons"
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../handleLogic/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();

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
                        chat here
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
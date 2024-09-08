import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer/SideDrawer";
import MyChats from "../components/MyChats/MyChats";
import ChatBox from "../components/ChatBox/ChatBox";
import { useState } from "react";

const ChatPage = () => {
    const { user } = ChatState();

    return(
        <div style={{width: "100%"}}>
            {user && <SideDrawer />}
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                w={"100%"}
                h={"90vh"}
                p={"10px"}
            >
                {user && <MyChats/>}
                {user && <ChatBox/>}
            </Box>
        </div>
    )
}

export default ChatPage;
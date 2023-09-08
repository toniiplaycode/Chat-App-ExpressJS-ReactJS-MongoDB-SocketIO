import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
    const { user, setUser } = ChatState();

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
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatPage;
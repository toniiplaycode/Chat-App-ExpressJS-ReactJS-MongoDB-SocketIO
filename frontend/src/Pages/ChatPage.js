import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer/SideDrawer";
import MyChats from "../components/MyChats/MyChats";
import ChatBox from "../components/ChatBox/ChatBox";
import { useState } from "react";

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false); // dùng để fetch lại các chat cho user khi có thay đổi gì đó

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
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage;
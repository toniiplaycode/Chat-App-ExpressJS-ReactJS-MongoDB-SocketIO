import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = () => {
    const {selectedChat, fetchAgain, setFetchAgain} = ChatState();

    return(
        <Box display={{base: selectedChat ? "flex" : "none", md: "flex"}}
            alignItems={"center"}
            flexDirection={"column"}
            p={3}
            background={"white"}
            w={{base: "100%", md: "70%"}}
            borderRadius={"lg"}
        >
            <SingleChat />
        </Box>
    )
}

export default ChatBox;
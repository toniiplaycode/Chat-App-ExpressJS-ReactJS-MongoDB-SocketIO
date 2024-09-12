import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = () => {
    const {selectedChat} = ChatState();

    return(
        <Box display={{base: selectedChat ? "flex" : "none", md: "flex"}}
            alignItems={"center"}
            flexDirection={"column"}
            p={3}
            background={"white"}
            w={"100%"}
            borderRadius={"lg"}
        >
            <SingleChat />
        </Box>
    )
}

export default ChatBox;
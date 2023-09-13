import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const {selectedChat} = ChatState();

    return(
        <Box display={{base: selectedChat ? "flex" : "none", md: "flex"}}
            alignItems={"center"}
            flexDirection={"column"}
            p={3}
            background={"white"}
            w={{base: "100%", md: "70%"}}
            borderRadius={"lg"}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox;
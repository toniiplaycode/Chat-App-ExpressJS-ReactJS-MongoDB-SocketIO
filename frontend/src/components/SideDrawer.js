import { Box, Button, Tooltip, Text } from "@chakra-ui/react";
import { useState } from "react";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);


    return(
        <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            bg={"white"}
            w={"100%"}
            p={"5px 10px"}
            borderWidth={"5px"}
        >
            <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                <Button>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: "none", md: "flex" }} px="6px">
                        Search user
                    </Text>
                </Button>
            </Tooltip>
        </Box>
    )
}

export default SideDrawer;
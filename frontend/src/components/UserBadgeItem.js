import { Box } from "@chakra-ui/react";
import { color } from "framer-motion";

const UserBadgeItem = ({user, handleFunction}) => {
    return(
        <Box
            px={2}
            py={1}
            borderRadius={"lg"}
            m={1}
            mb={2}
            background={"green"}
            color={"white"}
            cursor={"pointer"}
            onClick={handleFunction}
        >
            {user.name} 
            &nbsp;
            <i style={{color: "white"}} className="fa-solid fa-xmark"></i>
        </Box>
    )
}

export default UserBadgeItem;
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { StarIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import DialogConfirm from "./DialogConfirm";

const UserBadgeItem = ({user, handleFunction}) => {
    const { selectedChat} = ChatState();
    
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    return(
        <>
            <Box
                px={2}
                py={1}
                borderRadius={"lg"}
                m={1}
                mb={2}
                background={"green"}
                color={"white"}
                cursor={"pointer"}
                onClick={() => setIsOpenDialog(true)}

            >
                
                { 
                    user?._id === selectedChat?.groupAdmin._id 
                    ?
                        <StarIcon
                            boxSize={3}
                        />
                    :
                        <>
                        </>
                }

                &nbsp;
                {user.name} 
                &nbsp;
                <i style={{color: "white"}} className="fa-solid fa-xmark"></i>
            </Box>

            <div 
                style={{
                    display:"none"
                }}
            >
                <DialogConfirm isOpenDialog={isOpenDialog} setIsOpenDialog={setIsOpenDialog} handleFunction={handleFunction} />
            </div>
        </>
    )
}

export default UserBadgeItem;
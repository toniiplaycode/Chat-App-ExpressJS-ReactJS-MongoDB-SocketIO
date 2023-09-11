import { Box, Button, FormControl, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user, chats, setChats} = ChatState();

    const handleSearch =  async (query) => {
        setSearch(query);   

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`http://localhost:8800/api/user?search=${search}`, config)
            
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Search users failed !",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }

    const addToGroup = (userAdded) => {
        if(selectedUsers.includes(userAdded)) {
            toast({
                title: "User already added !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userAdded]);
    }

    const removeUser = (user) => {

    }

    const handleSubmit = () => {

    }

    return(
        <>
            {/* cách để children có thể dùng event khi đang nằm trong component cha */}
            <span onClick={onOpen}>{children}</span> 

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"} fontSize={"2xl"}>Create group chat</ModalHeader>
                    <ModalBody
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                    >
                        <FormControl>
                            <Input 
                                placeholder="Group name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Input 
                                placeholder="Add users: Toan, Tonii,..."
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box
                            display={"flex"}
                            flexWrap={"wrap"}
                        >
                            {selectedUsers.map(user => (
                                <UserBadgeItem 
                                key={user._id}
                                user={user}
                                handleFunction={()=>removeUser(user)}
                                />
                            ))}
                        </Box>

                        {loading 
                        ? ( <Spinner m={"auto"} display={"block"} mt={"20px"}/>)
                        : (
                            searchResult?.map(user => (
                                <UserListItem 
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>addToGroup(user)}
                                />
                            ))
                        )
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal;
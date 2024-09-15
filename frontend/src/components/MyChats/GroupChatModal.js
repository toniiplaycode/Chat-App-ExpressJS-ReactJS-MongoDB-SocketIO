import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserListItem";
import UserBadgeItem from "../UserBadgeItem";

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
                title: "Tìm người dùng thất bại !",
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
                title: "Người dùng đã được thêm vào !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userAdded]);
    }

    const removeUser = (userRemoved) => {
        setSelectedUsers(selectedUsers.filter( user => user._id !== userRemoved._id ));
    }

    const handleSubmit = async () => {
        if(!groupChatName || !setSelectedUsers) {
            toast({
                title: "Vui lòng điền đủ thông tin !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                    Authorization: `Bearer ${user.token}`,
                }
            }
            
            const { data } = await axios.post(`http://localhost:8800/api/chat/createGroup`, {
                            users: JSON.stringify(selectedUsers.map(user => user._id)), name: groupChatName}, config);

            setChats([...chats, data]); 
            onClose();
            toast({
                title: "Tạo thành công !",
                status: "success",
                duration: 3000,
                position: "top-right"
            })
            return;
        } catch (error) {
            toast({
                title: "Tạo thất bại !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }
    }

    return(
        <>
            {/* cách để children có thể dùng event khi đang nằm trong component cha */}
            <span onClick={onOpen}>{children}</span> 

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"} fontSize={"2xl"}>Tạo nhóm trò chuyện</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDirection={"column"}
                    >
                        <FormControl>
                            <Input 
                                placeholder="Tên nhóm"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Input 
                                placeholder="Thêm người dùng: Toan, Tonii,..."
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
                            Tạo
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal;
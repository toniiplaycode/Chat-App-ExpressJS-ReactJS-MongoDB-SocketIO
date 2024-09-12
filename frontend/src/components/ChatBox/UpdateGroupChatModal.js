import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const removeUser = async (userRemoved) => {
        if(selectedChat.groupAdmin._id !== user._id && userRemoved._id !== user._id) {
            toast({
                title: "Chỉ trưởng nhóm mới có thể mời ai đó rời nhóm !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        let changeGroupAdmin; // khi admin của group rời nhóm thì user khác sẽ được tự động thành admin

        if(userRemoved._id === selectedChat.groupAdmin._id) {
            selectedChat.users.map((user, i) => {
                if(user._id != selectedChat.groupAdmin._id)
                    changeGroupAdmin = user; 
                })
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.put("http://localhost:8800/api/chat/removeGroup", 
            {
                chatId: selectedChat._id,
                userId: userRemoved._id,
                changeGroupAdmin
            }
            ,config)

            userRemoved._id === user._id ?  setSelectedChat() : setSelectedChat(data); 
            setFetchAgain(!fetchAgain); // !fetchAgain để fetch lại
            fetchMessages(); // gọi lại fetchMessages của bên file SingleChat khi xoá 1 user khỏi group
            setLoading(false);
        } catch (error) {
            toast({
                title: "Mời người dùng khỏi nhóm thất bại !",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }

    const handleRename = async () => {
        if(!groupChatName) {
            toast({
                title: "Ô đổi tên nhóm không được để trống !",
                status: "error",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("http://localhost:8800/api/chat/renameGroup", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain); // !fetchAgain để fetch lại
            setRenameLoading(false);

            toast({
                title: "Đổi tên thành công !",
                status: "success",
                duration: 3000,
                position: "top-right"
            })
        } catch (error) {
            toast({
                title: "Đổi tên thất bại !",
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }

        setGroupChatName("");
    }

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
                title: "Tìm kiếm người dùng thất bại !",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }

    const addToGroup = async (userAdded) => {
        if(selectedChat.users.find(user => user._id === userAdded._id)) {
            toast({
                title: "Người dùng đã được thêm !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Chỉ trưởng nhóm mới thể thêm ai đó vào nhóm !",
                status: "warning",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.put("http://localhost:8800/api/chat/addGroup", 
            {
                chatId: selectedChat._id,
                userId: userAdded._id
            }
            ,config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain); // !fetchAgain để fetch lại
            setLoading(false);
        } catch (error) {
            toast({
                title: "Thêm người dùng thất bại !",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }

    return(
        <>
            <IconButton display={"flex"} icon={<ViewIcon/>} onClick={onOpen}/>
            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        textAlign={"center"}
                        fontSize={"2xl"}
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            display={"flex"}
                            flexWrap={"wrap"}
                        >
                            {selectedChat.users.map(u => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={()=>removeUser(u)}
                                />
                            ))}
                        </Box>

                        <FormControl display={"flex"}>
                            <Input
                                placeholder = "Đổi tên nhóm"
                                mb={3}
                                value={groupChatName}
                                onChange={(e)=>setGroupChatName(e.target.value)}
                            />
                            <Button
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Cập nhật
                            </Button>
                        </FormControl>
                        
                        <FormControl>
                            <Input 
                                placeholder="Thêm người dùng: Toan, Tonii,..."
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading 
                        ? ( <Spinner m={"auto"} display={"block"} mt={"20px"}/>)
                        : (
                            searchResult?.map(user => (
                                <UserListItem 
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>addToGroup(user)}
                                    showButtonAddUserGroup={true}
                                />
                            ))
                        )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={()=>removeUser(user)}>
                            Rời nhóm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    
    )
}

export default UpdateGroupChatModal;


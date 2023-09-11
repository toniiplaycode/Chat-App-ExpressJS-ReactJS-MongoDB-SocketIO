import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, useToast, flexbox } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router";
import axios from 'axios';
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, setSelectedChat, chats, setChats } = ChatState();
    
    const navigate = useNavigate();
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const logoutHandle = () => {
        localStorage.removeItem("userChatApp");
        navigate("/");
    }

    const toast = useToast();

    const handleSearch = async () => {
        if(search.trim().length === 0) {
            toast({
                title: "Please enter somthings in search !",
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
                    Authorization: `Bearer ${user.token}`,
                }    
            }

            const { data } = await axios.get(`http://localhost:8800/api/user?search=${search}`, config)

            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Search failed !",
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json", 
                    Authorization: `Bearer ${user.token}`,
                }    
            }

            const { data } = await axios.post("http://localhost:8800/api/chat", {userId}, config);
            
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);  

            setSelectedChat(data); 
            setLoadingChat(false);
            
            console.log("access chat: ", data);
            
            onClose(); 
        } catch (error) {
            toast({
                title: "Access chat failed !",
                description: error.message,
                status: "error",
                duration: 3000,
                position: "top-right"
            })
        }
    }
    
    return(
        <>
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
                    <Button onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px="6px">
                            Search user
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"}>Chat App</Text>
                <Box display={"flex"}>
                    <Menu>
                        <MenuButton mx={"10px"}>
                            <i className="fa-regular fa-bell" style={{fontSize: "1.2rem"}}></i>
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button}>
                            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                                <Avatar src={user.pic} size={"sm"} mr={"6px"} cursor={"pointer"} name={user.name} />
                                <p>
                                    {user.name}
                                </p>
                            </Box>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandle}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Search users</DrawerHeader>

                        <DrawerBody>
                            <Box display={"flex"} pb={"10px"}>
                                <Input
                                    placeholder="Search by name or email"
                                    value={search}
                                    onChange={(e)=>setSearch(e.target.value)}
                                    onKeyDown={(e)=> {
                                        e.key === "Enter" && handleSearch()
                                    }}
                                />
                                <Button ml={"10px"} onClick={handleSearch}>Go</Button>
                            </Box>

                            {loading ? (
                                <ChatLoading/>
                            ) : (
                                // dấu ? nếu searchResult null hoặc undefine thì nó cũng không gây ra lỗi
                                searchResult?.map((user) => 
                                    <UserListItem 
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                )
                            ) }

                            {loadingChat && <Spinner m={"auto"} display={"block"} mt={"20px"}/>}  
                        </DrawerBody>
                    </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;
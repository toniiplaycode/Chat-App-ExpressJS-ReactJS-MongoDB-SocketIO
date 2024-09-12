import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "../ProfileModal";
import { useNavigate } from "react-router";
import axios from 'axios';
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import { getSender } from "../../handleLogic/ChatLogic";
import "../../style/styleNotification.css";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [emptySearch, setEmptySearch] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, setSelectedChat, chats, setChats, notification, setNotification, fetchAgain, setFetchAgain } = ChatState();

    const navigate = useNavigate();
    
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const logoutHandle = () => {
        localStorage.removeItem("userChatApp");
        navigate("/");  
    }

    const handleSearch = async () => {
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
            if((data?.length == 0 || data == undefined)) {
                setEmptySearch("Không tìm thấy người dùng !");
            } else {
                setEmptySearch();
            }
        } catch (error) {
            // setEmptySearch("Không tìm thấy người dùng !");
            // toast({
            //     title: "Tìm kiếm thất bại !",
            //     status: "error",
            //     duration: 3000,
            //     position: "top-right"
            // })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                    Authorization: `Bearer ${user.token}`,
                }    
            }

            const { data } = await axios.post("http://localhost:8800/api/chat", {userId}, config);

            // if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); // nếu chưa có user trong đoạn chats thì thêm vào chats, có thêm đoạn code này cũng thừa, vì bên server đã xử lý rồi
                        
            setSelectedChat(data); 
            setLoadingChat(false);
            setFetchAgain(!fetchAgain);
            // console.log("access chat: ", data);
            onClose(); 
        } catch (error) {
            toast({
                title: "Truy cập trò chuyện thất bại",
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
                <Tooltip label="Tìm người dùng để trò chuyện" hasArrow placement="bottom-end">
                    <Button onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px="6px">
                            Tìm người dùng
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"}>Chat App</Text>
                <Box display={"flex"}>
                    <Menu>
                        <MenuButton mx={"10px"}>
                            <a href="#" className="notification">
                                <span>
                                    <i className="fa-regular fa-bell" style={{fontSize: "1.4rem"}}></i>
                                </span>
                                {
                                    notification.length > 0 && 
                                    <span className="badge w3-animate-top">
                                        {notification.length}
                                    </span>
                                }
                            </a>
                        </MenuButton>
                        <MenuList pl={"5px"}>
                            {!notification.length && "Không có tin nhắn mới"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter(n => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat 
                                    ? `Tin nhắn mới từ ${notif.chat.chatName}`
                                    : `Tin nhắn mới từ ${getSender(user, notif.chat.users)}`
                                    }      
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} my={"auto"}>
                            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                                <Avatar src={user.pic} size={"sm"} mr={"6px"} cursor={"pointer"} name={user.name} />
                                <p>
                                    {user.name}
                                </p>
                            </Box>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Hồ sơ của tôi</MenuItem>
                            </ProfileModal>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandle}>Đăng xuất</MenuItem>
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
                        <DrawerHeader>Tìm người dùng</DrawerHeader>

                        <DrawerBody>
                            <Box display={"flex"} pb={"10px"}>
                                <Input
                                    placeholder="Tìm bằng tên hoặc email"
                                    value={search}
                                    onChange={(e)=>{
                                        setSearch(e.target.value)
                                        handleSearch();
                                    }}
                                />
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
                                        showButtonAddUserGroup={false}
                                    />
                                )
                            ) }


                            {
                            emptySearch && 
                            <Text>
                                {emptySearch}
                            </Text> 
                            }

                            {loadingChat && <Spinner m={"auto"} display={"block"} mt={"20px"}/>}  
                        </DrawerBody>
                    </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;
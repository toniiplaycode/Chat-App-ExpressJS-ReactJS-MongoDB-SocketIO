import { Box, Button, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";
import axios from "axios";

const ProfileModal = ({userProfile, children}) => {
    const {user, fetchAgain, setFetchAgain} = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState();

    const toast = useToast();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedImageUrl(URL.createObjectURL(file));
          handleSendImg(file);
        } else {
          console.error('No file selected');
        }
    };

    const handleUpdate = async () => {
        if(!name && !password && !pic) {
            toast({
                title: "Hãy điền thông tin vào ô !",
                status: "error",
                duration: 3000,
                position: "top-right"
            })
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put("http://localhost:8800/api/user/updateUser", {
                id: user._id,
                name,
                password,
                pic
            }, config);
            
            localStorage.setItem("userChatApp", JSON.stringify(data));
            
            setLoading(false);
            setFetchAgain(!fetchAgain);

            toast({
                title: "Cập nhật hồ sơ thành công !",
                status: "success",
                duration: 3000,
                position: "bottom"
            })
        } catch (error) {
            toast({
                title: "Cập nhật hồ sơ thất bại !",
                status: "error",
                duration: 3000,
                position: "bottom"
            })
        }
        
        setSelectedImageUrl(null);
        onClose();
    }

    const handleSendImg = (file) => {
        setLoading(true);
        
        if(file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png") {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "chat-app"); // trùng với name của upload presets trên cloudinary
            data.append("cloud_name", "dj8ae1gpq");// trùng với name của clound name trên cloudinary
            fetch("https://api.cloudinary.com/v1_1/dj8ae1gpq/image/upload", {
                method: "post",
                body: data
            }) // thêm /image/upload
            .then((res)=> res.json())
            .then((data)=> {
                setPic(data.url.toString());
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
        
    }

    return(
        <div>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />
            )}

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                    <ModalContent>
                        <ModalHeader
                            fontSize={"2rem"}
                            textAlign={"center"}
                        >
                            {userProfile.name}
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalBody textAlign={"center"}>
                            <Image 
                                src={userProfile.pic}
                                boxSize={"100px"}
                                display={"block"}
                                margin={"-10px auto 10px auto"}
                                borderRadius={"50%"}
                                objectFit={"cover"}
                            />                       
                            <Text>
                               Email: {userProfile.email}
                            </Text> 

                            {user._id === userProfile._id &&
                            <>
                                <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    marginTop={"20px"}
                                >
                                    <Text
                                        width={"170px"}
                                        textAlign={"left"}
                                    >
                                        Đổi tên 
                                    </Text>
                                    <Input
                                        autoComplete="false"
                                        value={name}
                                        onChange={(e)=>setName(e.target.value)}
                                    />      
                                </Box>
                                <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    marginTop={"10px"}
                                >
                                    <Text
                                        width={"170px"}
                                        textAlign={"left"}
                                    >
                                        Đổi mật khẩu
                                    </Text>
                                    <Input
                                        autoComplete="false"
                                        type="password"
                                        value={password}
                                        onChange={(e)=>setPassword(e.target.value)}
                                    />      
                                </Box>
                                <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    marginTop={"10px"}
                                >
                                    <Text
                                        width={"170px"}
                                        textAlign={"left"}
                                    >
                                        Đổi ảnh
                                    </Text>
                                    <Input
                                        id="file"
                                        type="file"
                                        display="none" 
                                        onChange={handleFileChange} 
                                    />
                                    <Button
                                        as="label" 
                                        htmlFor="file"
                                        colorScheme="teal"
                                        cursor="pointer"
                                        width="100%"
                                    >
                                        Chọn ảnh
                                    </Button>
                                </Box>
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    
                                    marginTop={"10px"}
                                >
                                {selectedImageUrl &&
                                    <img
                                        style={{ 
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50%",
                                            objectFit: "cover"
                                        }}
                                        src={selectedImageUrl}  
                                    />
                                }
                                </Box>
                                <Button
                                    marginTop={"10px"}
                                    background={"green"}
                                    color={"white"}
                                    isLoading={loading}
                                    onClick={handleUpdate}
                                >
                                    Cập Nhật
                                </Button>
                            </>                                  
                            }
                        </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal;
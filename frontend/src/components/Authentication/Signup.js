import {VStack,FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast  } from '@chakra-ui/react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [selectedImageUrl, setSelectedImageUrl] = useState();

    const toast = useToast()
    let navigate = useNavigate();

    const handleFileChange = (file) => {
        if (file) {
          setSelectedImageUrl(URL.createObjectURL(file));
          postDetails(file);
        } else {
          console.error('No file selected');
        }
    };

    const postDetails = (pic) => {
        setLoading(true);
        if(pic === undefined) {
            toast({
                title: 'Vui lòng thêm ảnh !',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        
        if(pic.type === "image/jpg" || pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
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
            })
        }else{
            toast({
                title: 'Vui lòng thêm ảnh !',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

    }

    const handleSubmit = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: 'Vui lòng nhập đủ thông tin !',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            toast({
                title: 'Mật khẩu nhập lại không trùng !',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if(password.length < 8) {
            toast({
                title: 'Mật khẩu phải hơn 8 ký tự!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                }
            }

            const { data } = await axios.post("http://localhost:8800/api/user/signup",
                            {name, email, password, pic},
                            config);

            if(data.registerUser === false) {
                toast({
                    title: 'Email đã được sử dụng, hãy dùng email khác !',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })

                setLoading(false);
            } else {                                
                localStorage.setItem("userChatApp", JSON.stringify(data));
             
                toast({
                    title: 'Đăng ký thành công !',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
    
                setLoading(false);
                navigate('chats'); // điều hướng
            }
        } catch (error) {
            toast({
                title: 'Đã xảy ra lỗi !',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
        }
    }

    return(
        <VStack
            spacing={4}
        >
            <FormControl isRequired>
                <FormLabel>Tên</FormLabel>
                <Input 
                    placeholder='Nhập tên của bạn'
                    onChange={(e)=>setName(e.target.value)}
                />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    type='email'
                    placeholder='Nhập email của bạn'
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Mật khẩu</FormLabel>
                <InputGroup>
                    <Input 
                        type={showPassword ? "password" : "text"}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width={"4rem"} mx={1}>
                        <Button size={"sm"} onClick={()=>setShowPassword(!showPassword)}>
                            {showPassword  ? "Hiện" : "Ẩn"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <InputGroup>
                    <Input 
                        type={showConfirmPassword ? "password" : "text"}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width={"4rem"} mx={1}>
                        <Button size={"sm"} onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword  ? "Hiện" : "Ẩn"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Tải ảnh đại diện</FormLabel>
                <Input
                    id="file"
                    type="file"
                    display="none" 
                    accept='image/*'
                    onChange={(e)=>handleFileChange(e.target.files[0])} 
                />
                <Button
                    p={1.5}
                    as="label" 
                    htmlFor="file"
                    background="lightGrey"
                    cursor="pointer"
                    width="100%"
                >
                    Chọn ảnh
                </Button>
            </FormControl>
            
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

            <Button
            colorScheme='green'
            width={"100%"}
            marginTop={"20px"}
            onClick={handleSubmit}
            isLoading={loading}
            >
                Đăng ký
            </Button>
        </VStack>
    )
}
export default Signup;
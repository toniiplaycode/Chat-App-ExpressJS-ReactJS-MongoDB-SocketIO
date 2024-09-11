import {VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const toast = useToast();
    let navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        if(!email || !password) {
            toast({
                title: 'Vui lòng điền đủ thông tin !',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                }
            }

            const { data } = await axios.post("http://localhost:8800/api/user/login",
                            {email, password},
                            config);

            if(data.login === false) {
                toast({
                    title: 'Sai email hoặc mật khẩu, hãy thử lại !',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })

                setLoading(false);
            } else {
                localStorage.setItem("userChatApp", JSON.stringify(data));
                toast({
                    title: 'Đăng nhập thành công !',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                    
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
        <VStack spacing={4}>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    type='Email'
                    placeholder='Nhập email của bạn'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Mật khẩu</FormLabel>
                <InputGroup>
                    <Input 
                        type={showPassword ? "password" : "text"}
                        placeholder='Nhập mật khẩu của bạn'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width={"4rem"} mx={1}>
                        <Button size={"sm"} onClick={()=>setShowPassword(!showPassword)}>
                            {showPassword  ? "Hiện" : "Ẩn"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
            colorScheme='blue'
            width={"100%"}
            mt={2}
            onClick={handleSubmit}
            isLoading={loading}
            >
                Đăng nhập
            </Button>

            <Button
            colorScheme='red'
            width={"100%"}
            onClick={()=>{
                setEmail("guest@example.com");
                setPassword("123456");
            }}
            >
                Dùng thử tài khoản có sẵn
            </Button>
        </VStack>
    )
}
export default Login;
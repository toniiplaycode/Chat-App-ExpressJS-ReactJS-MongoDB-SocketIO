import {VStack,FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast  } from '@chakra-ui/react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    let navigate = useNavigate();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();


    const postDetails = (pic) => {
        setLoading(true);
        if(pic === undefined) {
            toast({
                title: 'Please select an image',
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
                console.log(data);
                setPic(data.url.toString());
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
        }else{
            toast({
                title: 'Please select an image',
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
                title: 'Please fill all feilds',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            toast({
                title: 'Passsword do not match',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }

            const { data } = await axios.post("http://localhost:8800/api/user/signup",
                            {name, email, password, pic},
                            config);
                                
            localStorage.setItem("userChatApp", JSON.stringify(data));
         
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            setLoading(false);
            navigate('chats'); // điều hướng
        } catch (error) {
            toast({
                title: 'Error Occured',
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
                <FormLabel>Name</FormLabel>
                <Input 
                    placeholder='Enter your name'
                    onChange={(e)=>setName(e.target.value)}
                />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    type='email'
                    placeholder='Enter your email'
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={showPassword ? "password" : "text"}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width={"4rem"} mx={1}>
                        <Button size={"sm"} onClick={()=>setShowPassword(!showPassword)}>
                            {showPassword  ? "Show" : "Hide"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input 
                        type={showConfirmPassword ? "password" : "text"}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width={"4rem"} mx={1}>
                        <Button size={"sm"} onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword  ? "Show" : "Hide"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <FormControl isRequired>
                <FormLabel>Upload your picture</FormLabel>
                <Input 
                    type='file'
                    accept='image/*'
                    p={1.5}
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
            colorScheme='green'
            width={"100%"}
            my={2}
            onClick={handleSubmit}
            isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}
export default Signup;
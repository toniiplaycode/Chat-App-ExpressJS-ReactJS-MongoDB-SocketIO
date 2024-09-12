import { Box, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';

const ModalImgPicker = ({ selectedImageUrl, handleSendImg, loading }) => {
    
    const { setIsOpenImgPicker } = ChatState();

    return (
        <Box
            style={{ 
                display: "flex",
                width: "200px",
                background: "#cccccc",
                position: "absolute",
                bottom: "34px",
                zIndex: "999",
                borderRadius: "10px"
            }}
        >
            <img
                style={{ 
                    width: "100%",
                    borderRadius: "10px"
                }}
                src={selectedImageUrl}  
            />
            <Button
                background={"#333"}
                color={"#fff"}
                padding={"20px 30px"}
                textAlign={"center"}
                onClick={()=>{
                    handleSendImg();
                    setTimeout(()=>{
                        setIsOpenImgPicker(false);
                    }, 1000)
                }}
                isLoading={loading}
            >
                Gửi
            </Button>
        </Box>
    )
}

export default ModalImgPicker

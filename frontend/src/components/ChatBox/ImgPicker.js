import { RxImage } from "react-icons/rx";
import React, { useEffect, useRef, useState } from 'react';
import ModalImgPicker from "./ModalImgPicker";
import io from "socket.io-client";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Toast } from "@chakra-ui/react";

let socket;

const ImgPicker = ({fetchMessages}) => {
  const fileInputRef = useRef(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);  
  const [selectedImageFile, setSelectedImageFile] = useState(null);  
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { user, selectedChat, fetchAgain, setFetchAgain, isOpenImgPicker, setIsOpenImgPicker } = ChatState();

  useEffect(() => {
    socket = io.connect("http://localhost:8800");

    socket.emit("setup", user); // gọi setup từ server gửi kèm user đang đăng nhập
  }, []);

  const handleImgSelect = () => {
    if (fileInputRef.current) { // khi click vào RxImage thì input sẽ được click
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageUrl(URL.createObjectURL(file));
      setSelectedImageFile(file);
      setIsOpenImgPicker(true);
    } else {
      console.error('No file selected');
    }
  };
  
  useEffect(()=>{
    if(!isOpenImgPicker) {
      setSelectedImageUrl(null);
      setSelectedImageFile(null);
    }
  },[isOpenImgPicker]);

  const handleSendImg = () => {
      setLoading(true);
      
      if(selectedImageFile.type === "image/jpg" || selectedImageFile.type === "image/jpeg" || selectedImageFile.type === "image/png") {
          const data = new FormData();
          data.append("file", selectedImageFile);
          data.append("upload_preset", "chat-app"); // trùng với name của upload presets trên cloudinary
          data.append("cloud_name", "dj8ae1gpq");// trùng với name của clound name trên cloudinary
          fetch("https://api.cloudinary.com/v1_1/dj8ae1gpq/image/upload", {
              method: "post",
              body: data
          }) // thêm /image/upload
          .then((res)=> res.json())
          .then((data)=> {
              setNewMessage(data.url.toString());
              setLoading(false);
          })
          .catch((error) => {
              console.log(error);
              setLoading(false);
          })
      }
  }
    
  useEffect(()=>{    
    const sendImgMessage = async () => {
      if(newMessage.trim().length > 0) {
        socket.emit("stop typing", selectedChat._id);

          try {
              const config = {
                  headers: {
                      "Content-type": "application/json", // khi gửi dữ liệu cho server dạng object thì dùng "Content-type": "application/json" đi kèm
                      Authorization: `Bearer ${user.token}`,
                  }    
              }
              
              setNewMessage("");

              const { data } = await axios.post("http://localhost:8800/api/message", 
              {
                  content: newMessage,
                  chatId: selectedChat._id,
              }, config);          
              
              // console.log(data);

              socket.emit("new message", data);
              fetchMessages();
              setFetchAgain(!fetchAgain)
          } catch (error) {
              Toast({
                  title: "Gửi tin nhắn thất bại !",
                  description: error.message,
                  status: "error",
                  duration: 3000,
                  position: "top-right"
              })

              setFetchAgain(!fetchAgain)
        }
      }
    }
    sendImgMessage();
  }, [newMessage]);

  return (
      <div
        style={{ 
          marginRight: "6px", 
          position: "relative"
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={(e) => handleFileChange(e)} 
          accept=".jpg, .jpeg, .png, .svg"
        />

        <RxImage 
          size={26} 
          cursor="pointer" 
          fontWeight="bold" 
          onClick={handleImgSelect} 
        />

        {(selectedImageUrl && isOpenImgPicker) && 
          <ModalImgPicker selectedImageUrl={selectedImageUrl} handleSendImg={handleSendImg} loading={loading} />
        }
    </div>
  );
}

export default ImgPicker;

import { AlertDialog, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react";

const DialogConfirm = ({isOpenDialog, setIsOpenDialog, handleFunction}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(()=>{
      if(isOpenDialog) onOpen();
    }, [isOpenDialog])

    return (
      <>
        <Button onClick={onOpen}>Discard</Button>
        <AlertDialog
          motionPreset='slideInBottom'
          onClose={()=>{
            setIsOpenDialog(false);
            onClose()
          }}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent>
            <AlertDialogHeader>Mời khỏi nhóm</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogFooter>
              <Button 
                onClick={()=>{
                  onClose()
                  setIsOpenDialog(false);
                }}
              >
                Huỷ
              </Button>
              <Button
                colorScheme='red' 
                onClick={()=>{
                  setIsOpenDialog(false);
                  onClose();
                  handleFunction();
                }} ml={3}
              >
                Chấp nhận
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
}

export default DialogConfirm;

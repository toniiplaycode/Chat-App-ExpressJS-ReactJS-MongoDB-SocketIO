import { IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

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
                            {user.name}
                        </ModalHeader>
                        <ModalCloseButton />

                        <ModalBody textAlign={"center"}>
                            <Image 
                                src={user.pic}
                                boxSize={"100px"}
                                display={"block"}
                                margin={"-10px auto 10px auto"}
                                borderRadius={"50%"}
                            />                       
                            <Text>
                               Email: {user.email}
                            </Text>         
                        </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal;
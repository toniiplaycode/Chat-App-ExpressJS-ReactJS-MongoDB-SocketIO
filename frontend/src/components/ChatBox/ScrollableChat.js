import ScrollableFeed from 'react-scrollable-feed'; // dùng ScrollableFeed để khi có thêm message mới được gửi thì nó tự động scroll
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, showDateOfLastestMessages, showTimeMessageSended } from '../../handleLogic/ChatLogic';
import { StarIcon } from "@chakra-ui/icons";
 
const ScrollableChat = ({messages, selectedChat}) => {
    const { user } = ChatState();
    
    return(
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <>
                    <div
                        style={{
                            display: "flex",
                            textAlign: "center",
                            marginBottom: "5px",
                            justifyContent: "center"
                        }}
                    >
                        <p
                            style={{
                                width: "100px",
                                background: "#D8D8D8",
                                fontSize: "12px", 
                                borderRadius: "2px"
                            }}
                        >
                            {
                                showDateOfLastestMessages(messages, m, i)
                            }
                        </p>
                    </div>

                    <div
                        key={m._id} 
                        style={{display: "flex"}} 
                        >
                        { (isSameSender(messages, m, i, user._id)
                        || isLastMessage(messages, i, user._id)) && 
                        (
                            <div
                                style={{
                                    position: "relative"
                                }}
                            >
                                <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow
                                >
                                    <Avatar
                                        mt={"-5px"}
                                        mr={1}
                                        size={"sm"}
                                        cursor={"pointer"}
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                        />
                                </Tooltip>
                                
                                {selectedChat.groupAdmin &&
                                m.sender._id === selectedChat.groupAdmin._id && (
                                    <StarIcon
                                        boxSize={3}
                                        style={{
                                            position: 'absolute',
                                            bottom: '16',
                                            left: '20',
                                        }}
                                    />
                                )}
                            </div>
                            
                        )
                    }
                        
                        <div
                            style={{
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                // marginTop: isSameUser(messages, m, i) ? 3 : 10,
                            }}
                            >
                            <span
                                style={{
                                    background: `${
                                        m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                    borderRadius: "10px",
                                    padding: "5px 6px",
                                }}
                                >
                                {m.content}
                            </span>
                            <p
                                style={{
                                    textAlign: `${
                                        m.sender._id === user._id ? "right" : "left"
                                        }`,
                                        marginTop: "5px",
                                        fontSize: "10px",
                                    }}
                                    >
                                { showTimeMessageSended(messages, m, i) }
                            </p>
                        </div>
                    </div>
                </>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat;

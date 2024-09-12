import ScrollableFeed from 'react-scrollable-feed'; // dùng ScrollableFeed để khi có thêm message mới được gửi thì nó tự động scroll
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Box, Tooltip } from '@chakra-ui/react';
import { getSender, isLastMessage, isSameSender, isSameSenderMargin, isSameUser, showDateOfLastestMessages, showTimeMessageSended } from '../../handleLogic/ChatLogic';
import { StarIcon } from "@chakra-ui/icons";
 
const ScrollableChat = ({messages}) => {
    const { user, selectedChat } = ChatState();

    return(
        <ScrollableFeed>
            {messages.length == 0 && 
                <p
                    style={{
                        textAlign: "center",
                    }}
                >
                    Hãy nhắn gì đó cho {getSender(user, selectedChat.users)}
                </p>
            }
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
                        style={{
                            display: "flex",
                            marginRight: "2px"
                        }} 
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
                        
                        <Box
                            marginLeft={isSameSenderMargin(messages, m, i, user._id)}
                            // marginTop: isSameUser(messages, m, i) ? 3 : 10,
                            maxWidth={{base: "250px", sm: "420px"}}
                            textWrap={"wrap"}
                        >
                            {m.content.split(":")[0] === "http" 
                            ? 
                                <img
                                    style={{
                                        width: "200px",
                                        background: "#cccccc",
                                        borderRadius: "10px",
                                        padding: "5px 6px",
                                    }}
                                    src={m.content}
                                /> 
                            : 
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
                            }
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
                        </Box>
                    </div>
                </>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat;

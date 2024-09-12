import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import '../../style/styleEmojiPicker.css';
import { BsEmojiSmile, BsEmojiSmileFill  } from "react-icons/bs";
import { ChatState } from '../../Context/ChatProvider';
import { Button } from '@chakra-ui/react';


const EmojiPicker = ({ onEmojiSelect }) => {
    const { isOpenEmojiPicker, setIsOpenEmojiPicker } = ChatState();

    const togglePicker = () => {
        setIsOpenEmojiPicker(!isOpenEmojiPicker);
    };

    const handleEmojiSelect = (emoji) => {
        onEmojiSelect(emoji.native);  // Truyền emoji cho component parent
    };

    return (
        <div className="emoji-picker-container">
            {isOpenEmojiPicker 
            ? <BsEmojiSmileFill className="emoji-icon" onClick={togglePicker} size={24} /> 
            : <BsEmojiSmile className="emoji-icon" onClick={togglePicker} size={24} />
            }
            {isOpenEmojiPicker && (
                <div className="emoji-picker-popup">
                    <Picker 
                        data={data} 
                        onEmojiSelect={handleEmojiSelect}
                    />
                    <Button>
                        X
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;

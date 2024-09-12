export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name; 
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0]; 
}


// hàm isSameSender và isLastMessage: hiển thị avatar cho người gửi message (nhắn nhiều message nhưng chỉ hiện avatar cho tin nhắn cuối cùng trước khi người nhận phản hồi)
export const isSameSender = (messages, m, i, userId) => {
  // console.log(m , i);
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId

  );
};

// hiển thị tên người dùng trên tin nhắn đầu tiên trong nhóm, không hiển thị tên của người đang nhắn
export const isEarliestMessage = (messages, i, userId) => {
  return (
    (messages[i]?.sender._id !== messages[i-1]?.sender._id) && (messages[i]?.sender._id !== userId)
  )
} 

// canh trái cho tin nhắn tin người gửi, canh phải cho tin nhắn người nhận
export const isSameSenderMargin = (messages, m, i, userId) => { 
    // console.log(m , i);

    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      m.sender._id !== userId
    )
      return 0;
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
  // console.log(m , i);

  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// hiển thị ngày của message
export const showDateOfLastestMessages = (messages, m, i) => {
  const dateBefore = messages[i-1]?.createdAt.split(' ')[1];
  const dateCurrent = m?.createdAt.split(' ')[1];

  if( dateBefore !== dateCurrent) {
    return dateCurrent;
  }
}


// hiển thị thời gian được gửi của tin nhắn, nếu thời gian hiện tại khác thời gian liền kế trước thì mới hiện, và lỡ nếu là vẫn trường hợp đó thì xét với người dùng liền kề trước khác thì mới hiện  
export const showTimeMessageSended = (messages, m, i) => {
  return formatTime(m) !== formatTime(messages[i+1]) ? formatTime(m) : (m.sender._id !== messages[i+1].sender._id) ? formatTime(m) : ""
}

export const formatTime = (message) => {
  // ví dụ: 20:27:14 07/09/2024, thì chỉ lấy 20:27
  return message?.createdAt.split(' ')[0].substring(0, 5)
}

// đếm thời gian gửi
export const countTimeSend = (timeMessageSend) => {
  const timeCurrent = new Date().toLocaleTimeString('en-GB', { hour12: false }) + " " + new Date().toLocaleDateString('en-GB'); 

  const timeCurrentGetTime = timeCurrent.split(' ')[0].substring(0, 5); // lấy giờ hiện tại 
  const timeMessageSendGetTime = formatTime(timeMessageSend); // lấy giờ của tin nhắn đã gửi 
  const timeCurrentGetDate = timeCurrent.split(' ')[1].substring(0, 10); // lấy ngày hiện tại 
  const timeMessageSendGetDate = timeMessageSend?.createdAt.split(' ')[1].substring(0, 10); // lấy ngày  của tin nhắn đã gửi

  const getSubtractTime = subtractTime(timeCurrentGetTime, timeMessageSendGetTime);
  const getSubtractDay = subtractDays(timeCurrentGetDate, timeMessageSendGetDate);

  if(getSubtractDay === 1) {
    return "Hôm qua"
  } else if(getSubtractDay === 0) {
    const time = getSubtractTime;
    if(time.split(":")[0] === "00") {
      if(time.split(":")[1] === "00") {
        return "Vài giây"
      } else return time.split(":")[1] + " phút" // lấy phút
    } else {
      return time.split(":")[0] + " giờ" // lấy giờ 
    }
  } else {
    return timeMessageSendGetDate;
  }

}
const subtractTime = (time1, time2) => {
  // Chuyển đổi thời gian thành phút
  const minutes1 = parseInt(time1?.split(':')[0]) * 60 + parseInt(time1?.split(':')[1]);
  const minutes2 = parseInt(time2?.split(':')[0]) * 60 + parseInt(time2?.split(':')[1]);

  // Tính chênh lệch thời gian
  let diffMinutes = minutes1 - minutes2;

  // Đảm bảo thời gian không âm
  if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Thêm 24 giờ nếu chênh lệch là âm
  }

  // Chuyển đổi lại thành giờ và phút
  const resultHours = Math.floor(diffMinutes / 60);
  const resultMinutes = diffMinutes % 60;

  // Trả về kết quả dưới dạng HH:MM
  return `${resultHours.toString().padStart(2, '0')}:${resultMinutes.toString().padStart(2, '0')}`;
}

const subtractDays = (date1, date2) => {
  if(date1 !== undefined && date2 !== undefined) {
    // Chuyển đổi từ dd/mm/yyyy sang đối tượng Date
    const [day1, month1, year1] = date1?.split('/');
    const [day2, month2, year2] = date2?.split('/');
  
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);
  
    // Tính số ngày chênh lệch
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}


export const whoIsSendMessage = (chat, loggedUser) => {
    const lastestMessage = chat?.lastestMessage;
    if(lastestMessage?.sender._id == loggedUser?._id) { // nếu chính bạn là người gửi
      return `Bạn: ${lastestMessage?.content.split(":")[0] === "http" ? "Đã gửi 1 ảnh" : lastestMessage?.content} `
    } else if(chat.isGroupChat) { // nếu là trong 1 group chat
      return `${lastestMessage?.sender?.name}: ${lastestMessage?.content.split(":")[0] === "http" ? "Đã gửi 1 ảnh" : lastestMessage?.content}`
    } else if(lastestMessage != undefined){ 
      return `${lastestMessage?.content.split(":")[0] === "http" ? "Đã gửi 1 ảnh" : lastestMessage?.content}`
    }
  }

export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser?._id ? users[1]?.name : users[0]?.name; 
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]; 
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
  // console.log(messages);
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId
    
  );
};

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
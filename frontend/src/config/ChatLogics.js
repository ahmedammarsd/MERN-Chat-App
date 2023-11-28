
export const getSender = (loggedUser , users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name  
}

export const getSenderFull = (loggedUser , users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]  
}


export const isSameSender = (messages , m , i , userId) => {
    /*
      // == MESSAGES - ALL MESSAGES
      // == M - CURRENT MESSAGE
      // == I - INDEX OF CURRENT MESSAGE
      // == USERID - ID OF USER
    */
    return (
        i < messages.length -1 
        && 
        // CHECK THE MESSAGE ITS NOT SEND BY SAME THE USER OR CHECK ALSO THE NEXT MESSAGE ITS NOT UNDEFINED
        (messages[i+1].sender._id !== m.sender.id || messages[i+1].sender._id === undefined)
        &&
        //CHECK CURRENT MESSAGE NOT EQUAL TO THE USER ID
        messages[i].sender._id !== userId 
    )
}

export const isLastMessage = (messages , i , userId) => {
    return (
        // CHECK THE CURRENT INDEX OF MASSAGE ITS LAST IN THE MESSAGES -- CHECK LAST MESSAGE
        i === messages.length - 1 
        &&
        // CHECK THE LAST MESSAGE TO NOT COME FROM THE USER LOGGED
        messages[messages.length - 1].sender._id !== userId 
        &&
        messages[messages.length - 1].sender._id 
    )
}



export const isSameSenderMargin = (messages , m , i , userId) => {
    if (
        i < messages.length-1 && messages[i+1].sender._id === m.sender._id && messages[i].sender._id !== userId
    ) return 33

    else if (
        ( i < messages.length-1 && messages[i+1].sender._id !== m.sender._id && messages[i].sender._id !== userId)
        ||
        (i === messages.length-1 && messages[i].sender._id !== userId)
    ) return 0
    else return "auto"
}

export const isSameUser = (messages, m , i) => {
    return i > 0 && messages[i-1].sender._id === m.sender._id
}
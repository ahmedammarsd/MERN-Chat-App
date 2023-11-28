import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();


const ChatProvider = ({children}) => {
    /// == STATES VALUES AND FUNCTIONS

    const navigate = useNavigate();

    const [user , setUser] = useState();
    const [selectChat , setSelectChat] = useState();
    const [chats , setChats] = useState([]);
    const [notification , setNotification] = useState([])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo)
        if (!userInfo) {
            navigate("/")
        }
    },[navigate]);

    const BaseUrl = "http://localhost:5000/";

    return (
        <ChatContext.Provider value={{
            /// === HERE TO SHARE THE STATES AND FUNCTION
            user ,BaseUrl , selectChat , setSelectChat , chats , setChats , notification , setNotification
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => useContext(ChatContext)
export default ChatProvider
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChat from "../components/MyChat";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
   const { user } = ChatState();
   const [ fetchAgain , setFetchAgain ] = useState(false)
  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer />}

      <Box
       display="flex"
       justifyContent={"space-between"}
       w="100%"
       h="91.5vh"
       p="10px"
      >
        {user && <MyChat fetchAgain={fetchAgain}  />} {/* USER AND GROUPS IN CHAT */}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} {/* THE CHAT WITH USER OR GROUP */}
      </Box>
    </div>
  )
}

export default ChatPage
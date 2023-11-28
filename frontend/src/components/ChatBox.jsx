import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const { selectChat } = ChatState()
  return (
    <Box 
     display={{base: selectChat ? "flex" : "none" , md: "flex"}}
     alignItems="center"
     flexDir="column"
     p={3}
     w={{base: "100%", md: "68%"}}
     borderRadius="lg"
     borderWidth="1px"
     bg="white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> 
    </Box>
  )
}

export default ChatBox
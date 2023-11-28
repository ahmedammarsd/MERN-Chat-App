import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import axios from "axios";

const MyChat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, BaseUrl, selectChat, setSelectChat, chats, setChats } =
    ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      // setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${BaseUrl}api/chat`, config);
      setChats(data);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error Occured",
        description: "Failed to Load The Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<IoMdAdd />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* HANDLE TO SHWO THE ALL CHATS */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectChat(chat)}
                cursor="pointer"
                bg={selectChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      {/* END HANDLE TO SHWO THE ALL CHATS */}
    </Box>
  );
};

export default MyChat;

import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MdArrowBackIosNew } from "react-icons/md";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import axios from "axios";
import "./singleChatStyle.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, BaseUrl, selectChat, setSelectChat , notification , setNotification} = ChatState();

  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => [
      setSocketConnected(true),
      console.log("socket work"),
    ]);

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectChat) return;

    try {
      const config = {
        headers: {
          "Content-type": "application-json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${BaseUrl}api/message/${selectChat._id}`,
        config
      );

      console.log("get messages", data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load The Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectChat._id);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `${BaseUrl}api/message`,
          {
            content: newMessage,
            chatId: selectChat._id,
          },
          config
        );
        setMessages([...messages, data]);
        console.log("data send", data);
        socket.emit("new message", data);
      } catch (error) {
        // console.log(newMessage , selectChat._id)
        // console.log("erre",error);
        toast({
          title: "Error Occured",
          description: "Failed to Load Or Send The Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setIsTyping(true);
      socket.emit("typing", selectChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectChat;
  }, [selectChat]);

  useEffect(() => {
    console.log("send or recived msg");
    socket.on("message recived", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // GIVE NOTIFICATION
        if (!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved , ...notification]);
          fetchAgain(!fetchAgain);
        }

      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  }, []);
  return (
    <>
      {selectChat ? ( // WHEN FOUND USER SELECTED FOR CHAT
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<MdArrowBackIosNew />}
              onClick={() => setSelectChat("")}
            />
            {!selectChat.isGroupChat ? (
              <>
                {getSender(user, selectChat.users)}
                {/* GET OR VIEW DATA USER THAT CHATING WITH HIM */}
                <ProfileModal user={getSenderFull(user, selectChat.users)} />
              </>
            ) : (
              <>
                {selectChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {/* MESSAGES */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignItems="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {/* Messages */}
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>TYPING...</div> : null}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter A Message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
            {/* MESSAGES */}
          </Box>
        </>
      ) : (
        // WHEN NOT FOUND USER SELECTED FOR CHAT
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click On User To Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

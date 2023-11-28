import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Avatar,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { IoSearch, IoNotificationsSharp } from "react-icons/io5";
import { GoChevronDown } from "react-icons/go";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const {
    user,
    BaseUrl,
    setSelectChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  /// ======  HADNLE SEARCH - SHOW USERS FOR SELECT AND START CHAT OR CONTENIO CHAT  ============
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something In Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${BaseUrl}api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to Load The Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  // ==================  START CHAT WHEN CLICK IN THE SPECIFC USER ==============
  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${BaseUrl}api/chat`,
        { userId: userId },
        config
      );
      /// IF FOUND THE CHAT UPDATE THE LIST CHATS
      if (!chats.find((c) => c._id === data.id)) setChats([data, ...chats]);
      setSelectChat(data);
      setLoading(false);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching The Chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
    setLoadingChat(false);
  };
  return (
    <>
      {/* THE NAVBAR */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* SEARCH USER IN NAVBAR FOR CHAT */}
        <Tooltip label="Search Users To Chat" placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <IoSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        {/* SEARCH USER IN NAVBAR FOR CHAT */}

        {/* TITLE */}
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        {/* PROFILE USER */}
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          {/* NOTIFICATION */}
          <Menu>
            <MenuButton p={1} position="relative">
              {/* CUSTOM COUNT NOTIFICATION */}
              {notification.length !== 0 ?
              <div
                style={{
                  position: "absolute",
                  top: -7,
                  right: -1,
                  width: "18px",
                  height: "18px",
                  padding: "2px",
                  borderRadius: "100%",
                  background: "red",
                  color: "white",
                  display:"flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px"
                }}
              >
                 {notification.length}
              </div>
              : null
              }
              {/* CUSTOM COUNT NOTIFICATION */}
              <IoNotificationsSharp
                style={{ margin: "1px", fontSize: "20px" }}
              />
            </MenuButton>
            {/* <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
            </MenuList> */}

            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
            </MenuList>
            {notification.map((not) => (
              <MenuItem
                key={not._id}
                onClick={() => {
                  setSelectChat(not.chat);
                  setNotification(notification.filter((n) => n !== not));
                }}
              >
                {not.chat.isGroupChat
                  ? `New Message in ${not.chat.chatName}`
                  : `New Message from ${getSender(user, not.chat.users)}`}
              </MenuItem>
            ))}
          </Menu>
          {/* END NOTIFICATION */}

          <Menu>
            <MenuButton as={Button} p={1} rightIcon={<GoChevronDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                {" "}
                {/* COMPONENT FOR SHOW PROFILE USER */}
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
        {/* END PROFILE USER */}
      </Box>
      {/* END NAVBAR */}

      {/* SIDEPAGE FOR SEARCH USERS  AND SELECT USER */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search By Name Or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((userr) => (
                <UserListItem
                  key={userr._id}
                  user={userr}
                  handleFunction={() => accessChat(userr._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* END SIDEPAGE FOR SEARCH USERS AND SELECT USER */}
    </>
  );
};

export default SideDrawer;

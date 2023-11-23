import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Text, Tooltip ,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Avatar,
} from '@chakra-ui/react';
import { IoSearch , IoNotificationsSharp } from "react-icons/io5";
import { GoChevronDown } from "react-icons/go";
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';

const SideDrawer = () => {
    const { user } = ChatState();
    const navigate = useNavigate()

    const handleLogout = () => {
      localStorage.removeItem("userInfo");
      navigate("/")
    }

    const [search , setSearch] = useState("")
    const [searchResult , setSearchResult] = useState([])
    const [loading , setLoading] = useState(false);
    const [loadingChat , setLoadingChat] = useState();
  return (
    <Box 
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     bg="white"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth="5px"
    >

        <Tooltip label="Search Users To Chat" placement="bottom-end">
            <Button variant="ghost">
                <IoSearch />
                <Text display={{base: "none", md: "flex"}} px="4">
                    Search User
                </Text>
            </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
            Talk-A-Tive
        </Text>

        <div style={{display: "flex",gap: "2px", alignItems: "center"}}>
          <Menu>
            <MenuButton p={1}>
                <IoNotificationsSharp style={{margin: "1px", fontSize: "20px"}} />
            </MenuButton>
            {/* <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
            </MenuList> */}
          </Menu>
          <Menu>
          <MenuButton as={Button} p={1} rightIcon={<GoChevronDown />}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
    </Box>
  )
}

export default SideDrawer
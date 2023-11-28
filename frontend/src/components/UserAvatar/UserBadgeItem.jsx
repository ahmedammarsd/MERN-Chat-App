import { Box } from '@chakra-ui/react'
import React from 'react';
import { IoIosClose } from "react-icons/io";

const UserBadgeItem = ({user , handleFunction}) => {
  return (
    <Box
     px={2} py={1}
     borderRadius="lg"
     m={1} mb={2}
    variant="solid" 
    bgColor="blue"
    color="white"
    cursor="pointer"
    fontSize={12}
    textTransform="capitalize"
    whiteSpace="nowrap"
    display="flex"
    onClick={handleFunction}
    >
        {
            user.name
        }
        <IoIosClose style={{paddingLeft: "5px", fontSize:"19px"}}/>
    </Box>
  )
}

export default UserBadgeItem
import { useState } from 'react'
import { Stack, HStack, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {

    const [email , setEmail] = useState();
    const [password , setPassword] = useState();
    const [loading , setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const [show , setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email || !password){
          toast({
            title: 'Please Fill All The Feilds',
            //description: "We've created your account for you.",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          setLoading(false);
          return
        }

        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post("http://localhost:5000/api/user/login",{email , password} , config);
          toast({
            title: 'Login Successful',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: "top"
          })
          localStorage.setItem("userInfo" , JSON.stringify(data));
          setLoading(false)
          navigate("/chat")
        }
        catch (err) {
          // console.log(err)
          setLoading(false);
          toast({
            title: 'Error Occured',
            description: err.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          })
        }

    }

  return (
    <VStack>
         <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
             placeholder='Enter Your Email'
             onChange={(e) => setEmail(e.target.value)}
             value={email}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
            type={show ? "text" : "password"}
             placeholder='Enter Your Password'
             onChange={(e) => setPassword(e.target.value)}
             value={password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
        </InputGroup>
        </FormControl>
        <Button
         colorScheme="blue"
         width="100%"
         style={{marginTop: 15}}
         onClick={handleSubmit}
         isLoading={loading}
        >
            Login
        </Button>
        <Button
        variant="solid"
         colorScheme="red"
         width="100%"
         style={{marginTop: 15}}
         onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
         }}
        >
            Get Guest User Credentials 
        </Button>
    </VStack>
  )
}

export default Login
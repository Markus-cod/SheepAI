import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export const Register = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Responsive values
  const marginTop = useBreakpointValue({ base: 4, sm: 6, md: 8 })
  const boxPadding = useBreakpointValue({ base: 4, sm: 6, md: 8 })
  const maxWidth = useBreakpointValue({ base: "100%", sm: "350px", md: "400px" })
  const fontSize = useBreakpointValue({ base: "xl", sm: "2xl" })
  const inputSize = useBreakpointValue({ base: "md", sm: "lg" })
  const buttonSize = useBreakpointValue({ base: "md", sm: "lg" })
  const outerPadding = useBreakpointValue({ base: "1rem", sm: "2rem", md: "3rem" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Handle registration logic here
  }

  return (
    <Box 
      p={outerPadding}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="full"
      >
        <Box
          maxW={maxWidth}
          w="full"
          mx="auto"
          mt={marginTop}
          p={boxPadding}
          bg={bgColor}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="lg"
        >
          <Text fontSize={fontSize} fontWeight="bold" textAlign="center" mb={6}>
            Create Account
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={inputSize === "md" ? "sm" : "md"}>
                  Email
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  size={inputSize}
                  focusBorderColor="primary.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize={inputSize === "md" ? "sm" : "md"}>
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    size={inputSize}
                    focusBorderColor="primary.500"
                  />
                  <InputRightElement height="100%">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      size={inputSize === "md" ? "sm" : "md"}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size={buttonSize}
                width="full"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Create Account
              </Button>
            </VStack>
          </form>

          <Text 
            textAlign="center" 
            mt={4}
            fontSize={inputSize === "md" ? "sm" : "md"}
          >
            Already have an account?{' '}
            <Text
              as="span"
              color="primary.500"
              fontWeight="bold"
              cursor="pointer"
              onClick={onToggleMode}
            >
              Sign in
            </Text>
          </Text>
        </Box>
      </MotionBox>
    </Box>
  )
}
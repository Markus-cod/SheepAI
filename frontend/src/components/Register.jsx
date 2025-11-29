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
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export const Register = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Handle registration logic here
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        maxW="400px"
        mx="auto"
        mt={8}
        p={8}
        bg={bgColor}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow="lg"
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
          Create Account
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                size="lg"
                focusBorderColor="primary.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  size="lg"
                  focusBorderColor="primary.500"
                />
                <InputRightElement height="100%">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="primary"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create Account
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" mt={4}>
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
  )
}
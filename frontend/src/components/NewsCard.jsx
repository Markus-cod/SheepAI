import { Box, Text, Image, VStack, HStack, Badge, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiClock, FiUser } from 'react-icons/fi'

const MotionBox = motion(Box)

export const NewsCard = ({ 
  title, 
  description, 
  imageUrl, 
  author, 
  date, 
  category,
  readTime,
  url
}) => {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bg: 'primary.500',
      }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
      )}
      
      <VStack p={6} align="start" spacing={4}>
        <HStack justify="space-between" width="full">
          <Badge colorScheme="primary" variant="subtle">
            {category}
          </Badge>
          <HStack spacing={3} color="gray.500" fontSize="sm">
            <HStack spacing={1}>
              <Icon as={FiClock} />
              <Text>{readTime}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiUser} />
              <Text>{author}</Text>
            </HStack>
          </HStack>
        </HStack>

        <Text fontSize="xl" fontWeight="bold" lineHeight="short">
          {title}
        </Text>

        <Text color="gray.600" _dark={{ color: 'gray.300' }} noOfLines={3}>
          {description}
        </Text>

        <Text fontSize="sm" color="gray.500">
          {new Date(date).toLocaleDateString()}
        </Text>
      </VStack>
    </MotionBox>
  )
}
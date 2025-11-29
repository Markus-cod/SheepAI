import { SimpleGrid, Box, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { NewsCard } from './NewsCard'

const MotionBox = motion(Box)

const sampleNews = [
  {
    id: 1,
    title: "The Future of Web Development",
    description: "Exploring the latest trends and technologies shaping the future of web development in 2024.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    author: "Jane Smith",
    date: "2024-01-15",
    category: "Technology",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Sustainable Tech Solutions",
    description: "How technology is helping create a more sustainable future for our planet.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    author: "John Doe",
    date: "2024-01-14",
    category: "Environment",
    readTime: "4 min"
  },
  {
    id: 3,
    title: "AI in Everyday Life",
    description: "The impact of artificial intelligence on our daily routines and work.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    author: "Alex Johnson",
    date: "2024-01-13",
    category: "AI",
    readTime: "6 min"
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export const NewsContainer = () => {
  return (
    <Box p={8}>
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={8}>
        Latest News
      </Text>
      
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <AnimatePresence>
            {sampleNews.map((news) => (
              <MotionBox key={news.id} variants={itemVariants}>
                <NewsCard {...news} />
              </MotionBox>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </MotionBox>
    </Box>
  )
}
import { useState } from "react";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { StaggeredMenu } from "./components/StaggeredMenu";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { TerminalText } from "./components/AnimatedText";
import { NewsCard } from "./components/NewsCard";
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box)

const sampleNews = [
  {
    id: 1,
    title: "The Future of Web Development: Exploring Modern Frameworks and Tools",
    description: "Exploring the latest trends and technologies shaping the future of web development in 2024. From AI-powered development tools to new frameworks that are changing how we build applications.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
    author: "Jane Smith",
    date: "2024-01-15",
    category: "Technology",
    readTime: "5 min",
    url:"#"
  },
  {
    id: 2,
    title: "Sustainable Tech Solutions for a Better Tomorrow",
    description: "How technology is helping create a more sustainable future for our planet. Innovative solutions in renewable energy, smart cities, and eco-friendly applications.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500",
    author: "John Doe",
    date: "2024-01-14",
    category: "Environment",
    readTime: "4 min",
    url:"#"
  },
  {
    id: 3,
    title: "AI in Everyday Life: Transforming How We Live and Work",
    description: "The impact of artificial intelligence on our daily routines and work. From smart assistants to automated workflows, AI is revolutionizing every aspect of modern life.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
    author: "Alex Johnson",
    date: "2024-01-13",
    category: "AI",
    readTime: "6 min",
    url:"#"
  },
  {
    id: 4,
    title: "Cybersecurity in the Modern Digital Landscape",
    description: "Understanding the latest threats and protection mechanisms in today's interconnected world. Essential security practices for developers and businesses.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500",
    author: "Sarah Chen",
    date: "2024-01-12",
    category: "Security",
    readTime: "7 min",
    url:"#"
  },
  {
    id: 5,
    title: "The Rise of Quantum Computing",
    description: "How quantum computing is set to revolutionize data processing and solve complex problems that are impossible for classical computers.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500",
    author: "Mike Rodriguez",
    date: "2024-01-11",
    category: "Quantum",
    readTime: "8 min",
    url:"#"
  },
  {
    id: 6,
    title: "Cloud Native Development Best Practices",
    description: "Modern approaches to building scalable, resilient applications in cloud environments. Microservices, containers, and serverless architectures.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
    author: "Emily Watson",
    date: "2024-01-10",
    category: "Cloud",
    readTime: "5 min",
    url:"#"
  }
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

function App() {
  const [currentView, setCurrentView] = useState("home");

  console.log("Current view:", currentView);

  const renderContent = () => {
    console.log("Rendering content for:", currentView);

    switch (currentView) {
      case "login":
        return <Login onToggleMode={() => setCurrentView("register")} />;
      case "register":
        return <Register onToggleMode={() => setCurrentView("login")} />;
      default:
        return (
          <Container 
            maxW="container.xl" 
            py={12} 
            px={{ base: 4, md: 6, lg: 8 }}
          >
            <Box mb={12} textAlign="center">
              <TerminalText 
                text="Latest Tech News" 
                speed={30} 
                fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              />
            </Box>
            
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={{ base: 6, md: 8, lg: 10 }}
            >
              <AnimatePresence>
                {sampleNews.map((news, index) => (
                  <MotionBox 
                    key={news.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NewsCard {...news} />
                  </MotionBox>
                ))}
              </AnimatePresence>
            </SimpleGrid>
          </Container>
        );
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <StaggeredMenu onNavigate={setCurrentView} />
      {renderContent()}
    </Box>
  );
}

export default App;
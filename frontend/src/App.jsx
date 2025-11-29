import { useState } from "react";
import { Box, Container} from "@chakra-ui/react";
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
    title: "The Future of Web Development",
    description:
      "Exploring the latest trends and technologies shaping the future of web development in 2024.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    author: "Jane Smith",
    date: "2024-01-15",
    category: "Technology",
    readTime: "5 min",
    url:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
  },
  {
    id: 2,
    title: "Sustainable Tech Solutions",
    description:
      "How technology is helping create a more sustainable future for our planet.",
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    author: "John Doe",
    date: "2024-01-14",
    category: "Environment",
    readTime: "4 min",
    url:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
  },
  {
    id: 3,
    title: "AI in Everyday Life",
    description:
      "The impact of artificial intelligence on our daily routines and work.",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    author: "Alex Johnson",
    date: "2024-01-13",
    category: "AI",
    readTime: "6 min",
    url:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
  },
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

  console.log("Current view:", currentView); // Debug log

  const renderContent = () => {
    console.log("Rendering content for:", currentView); // Debug log

    switch (currentView) {
      case "login":
        return <Login onToggleMode={() => setCurrentView("register")} />;
      case "register":
        return <Register onToggleMode={() => setCurrentView("login")} />;
      default:
        return (
          <Container centerContent py={20} gap={3}>
            <TerminalText text="Welcome to Modern News" speed={30} />
            <AnimatePresence>
              {sampleNews.map((news) => (
                <MotionBox key={news.id} variants={itemVariants}>
                  <NewsCard {...news} />
                </MotionBox>
              ))}
            </AnimatePresence>
          </Container>
        );
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} p={4}>
      <StaggeredMenu onNavigate={setCurrentView} />
      {renderContent()}
    </Box>
  );
}

export default App;

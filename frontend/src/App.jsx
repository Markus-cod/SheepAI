import { useEffect, useState } from "react";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { StaggeredMenu } from "./components/StaggeredMenu";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { TerminalText } from "./components/ui/AnimatedText";
import { NewsCard } from "./components/NewsCard";
import { motion, AnimatePresence } from "framer-motion";
import { getNews } from "./util";

const MotionBox = motion(Box);

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [news, setNews] = useState();

  useEffect(() => {
    getNews().then((news) => setNews(news.slice(0, 10)));
  }, []);

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
            py={120}
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
                {news &&
                  news.map((newsId, index) => {
                    return (
                      <MotionBox
                        key={newsId}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NewsCard newsId={newsId} />
                      </MotionBox>
                    );
                  })}
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


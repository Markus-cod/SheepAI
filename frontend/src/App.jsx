import { useState } from 'react'
import { Box, Container, Text, Button, VStack } from '@chakra-ui/react'
import { StaggeredMenu } from './components/StaggeredMenu'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { NewsContainer } from './components/NewsContainer'
import { TerminalText } from './components/AnimatedText'
import { NewsCard } from './components/NewsCard'

function App() {
  const [currentView, setCurrentView] = useState('home')

  console.log('Current view:', currentView) // Debug log

  const renderContent = () => {
    console.log('Rendering content for:', currentView) // Debug log
    
    switch (currentView) {
      case 'login':
        return <Login onToggleMode={() => setCurrentView('register')} />
      case 'register':
        return <Register onToggleMode={() => setCurrentView('login')} />
      case 'news':
        return <NewsContainer />
      default:
        return (
          <Container centerContent py={20}>
            <TerminalText text="Welcome to Modern News" speed={30} />
            <NewsCard></NewsCard>
          </Container>
        )
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} p={4}>
      <StaggeredMenu onNavigate={setCurrentView} />
      {renderContent()}
    </Box>
  )
}

export default App



import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Spacer,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Center,
  SimpleGrid,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { DeleteIcon, CheckIcon, AddIcon } from '@chakra-ui/icons'

const API_BASE = 'http://localhost:8000'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [connectionError, setConnectionError] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setConnectionError(false)
      const response = await axios.get(`${API_BASE}/tasks`)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setConnectionError(true)
      showToast('error', 'Connection Error', 'Cannot connect to backend. Make sure the server is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('warning', 'Title required', 'Please enter a task title.')
      return
    }

    try {
      setActionLoading('create')
      setConnectionError(false)
      await axios.post(`${API_BASE}/tasks`, {
        title: title.trim(),
        description: description.trim(),
        completed: false
      })
      setTitle('')
      setDescription('')
      fetchTasks()
      showToast('success', 'Task created', 'Your task has been added successfully.')
    } catch (error) {
      console.error('Error creating task:', error)
      setConnectionError(true)
      showToast('error', 'Failed to create task', 'Check backend connection and CORS configuration.')
    } finally {
      setActionLoading(null)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      setActionLoading(taskId)
      setConnectionError(false)
      await axios.delete(`${API_BASE}/tasks/${taskId}`)
      fetchTasks()
      showToast('success', 'Task deleted', 'Task has been removed.')
    } catch (error) {
      console.error('Error deleting task:', error)
      setConnectionError(true)
      showToast('error', 'Failed to delete task', 'Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      setActionLoading(`toggle-${taskId}`)
      setConnectionError(false)
      const taskToUpdate = tasks.find(task => task.doc_id === taskId)
      await axios.put(`${API_BASE}/tasks/${taskId}`, {
        ...taskToUpdate,
        completed: !currentStatus
      })
      fetchTasks()
      showToast('success', 'Task updated', `Task marked as ${!currentStatus ? 'completed' : 'pending'}.`)
    } catch (error) {
      console.error('Error updating task:', error)
      setConnectionError(true)
      showToast('error', 'Failed to update task', 'Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const showToast = (status, title, description) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    })
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="4xl">
        {/* Header */}
        <VStack spacing={6} mb={10} textAlign="center">
          <Heading 
            size="2xl" 
            bgGradient="linear(to-r, blue.500, purple.500)"
            bgClip="text"
          >
            🚀 Task Manager
          </Heading>
          <Text fontSize="xl" color="gray.600">
            FastAPI + React 18 + Chakra UI + TinyDB
          </Text>
        </VStack>

        {/* Connection Status Alert */}
        {connectionError && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            Cannot connect to backend. Make sure the server is running on port 8000 and CORS is configured.
          </Alert>
        )}

        {/* Task Creation Form */}
        <Card shadow="lg" mb={8}>
          <CardHeader pb={4}>
            <Heading size="md">Add New Task</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={createTask}>
              <VStack spacing={4}>
                <Input
                  placeholder="Enter task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isDisabled={actionLoading === 'create' || connectionError}
                  size="lg"
                  bg="white"
                />
                <Textarea
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isDisabled={actionLoading === 'create' || connectionError}
                  size="lg"
                  bg="white"
                  rows={3}
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  leftIcon={<AddIcon />}
                  isLoading={actionLoading === 'create'}
                  loadingText="Adding Task..."
                  isDisabled={!title.trim() || connectionError}
                >
                  Add Task
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Tasks List */}
        <Card shadow="lg">
          <CardHeader>
            <Flex align="center">
              <Heading size="md">Your Tasks</Heading>
              <Spacer />
              <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Center py={8}>
                <VStack spacing={4}>
                  <Spinner size="xl" color="blue.500" />
                  <Text color="gray.600">Loading tasks...</Text>
                </VStack>
              </Center>
            ) : tasks.length === 0 ? (
              <Center py={8}>
                <VStack spacing={3}>
                  <Text fontSize="lg" color="gray.500">
                    {connectionError ? 'Cannot load tasks - Backend connection failed' : 'No tasks yet. Add your first task above!'}
                  </Text>
                  {connectionError && (
                    <Text fontSize="sm" color="gray.400">
                      Check if backend server is running on port 8000
                    </Text>
                  )}
                </VStack>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {tasks.map((task) => (
                  <Card 
                    key={task.doc_id} 
                    variant="outline"
                    borderLeft="4px"
                    borderLeftColor={task.completed ? 'green.500' : 'orange.500'}
                    _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    <CardHeader pb={2}>
                      <Flex align="start" justify="space-between">
                        <VStack align="start" spacing={1} flex={1}>
                          <Heading 
                            size="sm" 
                            textDecoration={task.completed ? 'line-through' : 'none'}
                            color={task.completed ? 'gray.500' : 'gray.700'}
                            cursor="pointer"
                            onClick={() => toggleTaskCompletion(task.doc_id, task.completed)}
                          >
                            {task.title}
                          </Heading>
                          {task.description && (
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {task.description}
                            </Text>
                          )}
                        </VStack>
                        <HStack spacing={1} ml={2}>
                          <IconButton
                            icon={task.completed ? <CheckIcon /> : <CheckIcon />}
                            size="sm"
                            colorScheme={task.completed ? 'green' : 'gray'}
                            variant={task.completed ? 'solid' : 'outline'}
                            onClick={() => toggleTaskCompletion(task.doc_id, task.completed)}
                            isLoading={actionLoading === `toggle-${task.doc_id}`}
                            isDisabled={connectionError}
                            aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => deleteTask(task.doc_id)}
                            isLoading={actionLoading === task.doc_id}
                            isDisabled={connectionError}
                            aria-label="Delete task"
                          />
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardFooter pt={2}>
                      <Flex width="full" justify="space-between" align="center">
                        <Badge
                          colorScheme={task.completed ? 'green' : 'orange'}
                          variant="subtle"
                        >
                          {task.completed ? 'Completed' : 'Pending'}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          ID: {task.doc_id}
                        </Text>
                      </Flex>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

export default App
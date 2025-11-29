import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiClock, FiUser } from "react-icons/fi";

const MotionBox = motion(Box);

export const NewsCard = ({
  title,
  description,
  imageUrl,
  author,
  date,
  category,
  readTime,
  url,
}) => {
  const cardHeight = useBreakpointValue({
    base: "auto",
    md: "320px",
    lg: "360px",
  });
  const imageWidth = useBreakpointValue({
    base: "100%",
    md: "320px",
    lg: "380px",
  });
  const direction = useBreakpointValue({ base: "column", md: "row" });
  const titleSize = useBreakpointValue({ base: "lg", md: "xl", lg: "2xl" });
  const descriptionSize = useBreakpointValue({ base: "sm", md: "md" });
  const spacing = useBreakpointValue({ base: 3, md: 4, lg: 5 });

  return (
    <MotionBox
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      bg="white"
      _dark={{ bg: "gray.800" }}
      overflow="hidden"
      boxShadow="xl"
      borderRadius="2xl"
      border="1px"
      borderColor="gray.100"
      display="flex"
      flexDirection={direction}
      height={{ base: "auto", md: cardHeight }}
      minHeight={{ base: "auto", md: "320px" }}
      width="100%"
      maxWidth="100%"
      position="relative"
      _hover={{
        boxShadow: "2xl",
        borderColor: "blue.200",
        _dark: {
          borderColor: "blue.600",
          boxShadow: "dark-lg",
        },
      }}
    >
      {/* Image Section */}
      {imageUrl && (
        <Box
          flex={{ base: "0 0 auto", md: `0 0 ${imageWidth}` }}
          width={{ base: "100%", md: imageWidth }}
          height={{ base: "200px", md: "100%" }}
          position="relative"
          overflow="hidden"
          minHeight={{ base: "200px", md: "auto" }}
        >
          <Image
            src={imageUrl}
            alt={title}
            width="100%"
            height="100%"
            objectFit="cover"
            transition="transform 0.4s ease"
            _hover={{ transform: "scale(1.05)" }}
          />
          {/* Category Badge Overlay */}
          <Box position="absolute" top="3" left="3"></Box>
        </Box>
      )}

      {/* Content Section */}
      <VStack
        p={{ base: 4, md: 6, lg: 7 }}
        align="start"
        spacing={spacing}
        flex="1"
        justify="space-between"
        width="100%"
        overflow="hidden"
      >
        <VStack
          align="start"
          spacing={spacing}
          width="100%"
          flex="1"
          overflow="hidden"
        >
          {/* Metadata */}
          <HStack
            justify="space-between"
            width="100%"
            flexWrap="wrap"
            gap={2}
            color="gray.500"
            fontSize="sm"
          >
            <HStack spacing={4}>
              <HStack spacing={1}>
                <Icon as={FiClock} boxSize={4} />
                <Text>{readTime}</Text>
              </HStack>
              <HStack spacing={1}>
                <Badge
                  colorScheme="blue"
                  variant="solid"
                  fontSize="xs"
                  fontWeight="bold"
                  px={3}
                  py={1}
                  borderRadius="full"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  boxShadow="md"
                >
                  {category}
                </Badge>
              </HStack>
            </HStack>
          </HStack>

          {/* Title */}
          <Text
            fontSize={titleSize}
            fontWeight="bold"
            lineHeight="1.3"
            color="gray.900"
            _dark={{ color: "white" }}
            noOfLines={3}
            width="100%"
          >
            {title}
          </Text>

          {/* Description */}
          <Text
            color="gray.600"
            _dark={{ color: "gray.300" }}
            fontSize={descriptionSize}
            lineHeight="1.6"
            noOfLines={4}
            width="100%"
            flex="1"
            overflow="hidden"
          >
            {description}
          </Text>
        </VStack>

        {/* Date */}
        <Box
          width="100%"
          pt={2}
          borderTop="1px"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.600" }}
        >
          <Text
            fontSize="sm"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            fontWeight="medium"
          >
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Box>
      </VStack>

      {/* Gradient Border Effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        borderRadius="2xl"
        pointerEvents="none"
        boxShadow="inset 0 0 0 1px rgba(255,255,255,0.1)"
        _dark={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}
      />
    </MotionBox>
  );
};



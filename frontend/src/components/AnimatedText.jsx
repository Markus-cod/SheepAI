import { Text } from "@chakra-ui/react";
import TextType from "./ui/TerminalText";

export const TerminalText = ({ text, speed = 50 }) => {
  return (
    <Text
      fontSize="4xl"
      fontWeight="bold"
      color="primary.500"
    >
      <TextType
        text={text}
        typingSpeed={speed}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="_"
        loop={false}
      />
    </Text>
  );
};

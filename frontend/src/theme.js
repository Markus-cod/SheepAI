import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#e0fff4",
      100: "#b3ffdf",
      200: "#80ffc9",
      300: "#4dffb4",
      400: "#26ffa3",
      500: "#00ff94", // primary
      600: "#00e07a",
      700: "#00b261",
      800: "#008347",
      900: "#00542d",
    },
  },
  fonts: {
    heading: "'JetBrains Mono', monospace",
    body: "'JetBrains Mono', monospace",
    mono: "'JetBrains Mono', monospace",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "blue.950" : "white",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },
});

export default theme;

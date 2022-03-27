import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { MimicFinanceProvider } from "../contexts/MimicFinanceContext";
import store from "../store";

import Nav from "../components/Utils/Navbar/Navbar";
import "../styles/globals.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/inter/400.css";
import theme from "../theme";

import { Footer } from "../components/Utils/Footer/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
        <MimicFinanceProvider>
          <Nav />
          <Component {...pageProps} />
          <Footer />
        </MimicFinanceProvider>
      </ChakraProvider>
    </ReduxProvider>
  );
}

export default MyApp;

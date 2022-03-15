import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { Web3Provider } from "../contexts/Web3Context";
import store from "../store";

import Nav from "../components/utils/Navbar";
import "../styles/globals.css";
import "@fontsource/montserrat/400.css";
import theme from "../theme";

import { Footer } from "../components/utils/footer/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
        <Web3Provider>
          <Nav />
          <Component {...pageProps} />
          <Footer />
        </Web3Provider>
      </ChakraProvider>
    </ReduxProvider>
  );
}

export default MyApp;

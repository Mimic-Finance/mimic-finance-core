import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";

import Nav from "../components/utils/Navbar";
import "@fontsource/montserrat/400.css";
import theme from "../theme";
import { Footer } from "../components/utils/footer/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <DAppProvider config={{}}>
      <ChakraProvider theme={theme}>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </DAppProvider>
  );
}

export default MyApp;

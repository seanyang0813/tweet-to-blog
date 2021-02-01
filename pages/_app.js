import { Provider } from "next-auth/client";
import { ChakraProvider } from "@chakra-ui/react";
import Nav from "../components/nav.js";

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <Nav></Nav>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

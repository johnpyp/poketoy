import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { client } from "./graphql/client";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

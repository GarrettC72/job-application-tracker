import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import { store } from "./app/store";
import { API_BASE_URL } from "./constants";
import App from "./App";
import storageService from "./services/storage";

const authLink = setContext((_, { headers }) => {
  const user = storageService.loadUser();

  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: API_BASE_URL,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

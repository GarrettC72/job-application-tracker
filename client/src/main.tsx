import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import { store } from "./app/store";
import { API_BASE_URL, SUBSCRIPTION_URL } from "./constants";
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

const wsLink = new GraphQLWsLink(createClient({ url: SUBSCRIPTION_URL }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
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

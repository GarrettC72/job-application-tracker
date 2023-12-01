import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

import { API_BASE_URL, SUBSCRIPTION_URL } from "../constants";
import storageService from "../services/storage";

export const getWsHttpSplitLink = () => {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: SUBSCRIPTION_URL,
    })
  );

  const authLink = setContext((_, { headers }) => {
    const user = storageService.loadUser();

    return {
      headers: {
        ...headers,
        authorization: user ? `Bearer ${user.token}` : null,
      },
    };
  });

  const httpLink = createHttpLink({ uri: API_BASE_URL });

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

  return splitLink;
};

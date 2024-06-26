import { createHttpLink, from, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

import { API_BASE_URL, SUBSCRIPTION_URL } from "../constants";
import storageService from "../services/storage";

export const getWsHttpSplitLink = () => {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: SUBSCRIPTION_URL,
      connectionParams: () => {
        const token = storageService.loadToken();
        return {
          authorization: token ? `Bearer ${token}` : null,
        };
      },
    })
  );

  const authLink = setContext((_, { headers }) => {
    const token = storageService.loadToken();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });

  const httpLink = createHttpLink({ uri: API_BASE_URL });

  const removeTypenameLink = removeTypenameFromVariables();

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

  const link = from([removeTypenameLink, splitLink]);

  return link;
};

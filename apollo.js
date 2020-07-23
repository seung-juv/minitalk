import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const httpLink = new HttpLink({
  uri: "http://prismagram.kingsky32.co.kr:4000",
  // Need Authorization
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrYmc1ZGNxOHNybGswOTk5ZzdodzZ1ejEiLCJpYXQiOjE1OTU1MDI2Mzl9.Z8xDjQ_buxEMdoSEGMDMz-OmuPm_G8VboN9YR5ZHWxw"
  }
});

const wsLink = new WebSocketLink({
  uri: `ws://prismagram.kingsky32.co.kr:4000/`,
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
      },
      wsLink,
      httpLink
    )
  ]),
  cache: new InMemoryCache()
});

export default client;

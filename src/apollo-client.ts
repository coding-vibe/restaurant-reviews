import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink, Observable } from "@apollo/client/core";
import { createHttpLink } from "@apollo/client/link/http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { FetchResult } from "@apollo/client/link/core";
import { GraphQLError } from "graphql";
import Cookies from "js-cookie";

import { TokenNames } from "./constants/tokens";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});

// TODO: correct on BE, should be UNAUTHENTICATED
const UNAUTHENTICATED_ERROR_CODE = "FORBIDDEN";

const refreshToken = async () => {
  const refreshToken = Cookies.get(TokenNames.REFRESH_TOKEN);

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: TokenNames.REFRESH_TOKEN,
      variables: {
        token: refreshToken,
      },
      query: `
        mutation refreshToken($token: String!) {
          refreshToken(token: $token) {
            accessToken
            refreshToken
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const { data } = await response.json();

  if (!data) {
    throw new Error("No data returned from server");
  }

  Cookies.set(TokenNames.ACCESS_TOKEN, data.refreshToken.accessToken, {
    expires: 1,
  });
  Cookies.set(TokenNames.REFRESH_TOKEN, data.refreshToken.refreshToken, {
    expires: 1,
  });

  return data.refreshToken.accessToken;
};

const authLink = setContext((operation, { headers }) => {
  const token = Cookies.get(TokenNames.ACCESS_TOKEN);

  if (!token || operation.operationName === TokenNames.REFRESH_TOKEN) {
    return { headers };
  }

  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err?.extensions?.code) {
          case UNAUTHENTICATED_ERROR_CODE:
            if (operation.operationName === TokenNames.REFRESH_TOKEN) return;

            return new Observable<FetchResult<Record<string, unknown>>>(
              (observer) => {
                (async () => {
                  try {
                    const accessToken = await refreshToken();

                    if (!accessToken) {
                      throw new GraphQLError("No access token provided");
                    }

                    // Retry the failed request
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                  } catch (err) {
                    observer.error(err);
                  }
                })();
              }
            );
        }
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

export default client;

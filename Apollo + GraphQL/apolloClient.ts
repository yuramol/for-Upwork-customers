import { ApolloClient, NormalizedCacheObject, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
// import { RestLink } from 'apollo-link-rest';
import { useMemo } from 'react';
import type { AppProps } from 'next/app';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { IncomingHttpHeaders } from 'http';
import { getAccessToken } from '../helpers/getAccessToken';
import { apolloCache } from './apolloCacheConfig';
import { createUploadLink } from 'apollo-upload-client';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

export const createApolloClient = (headers: IncomingHttpHeaders | null = null) => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const authLink = setContext(async (_, { headers }) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
    }
    return {
      headers: {
        ...headers,
      },
    };
  });

  const httpLink = createUploadLink({
    uri: `${process.env.BASE_API_URL}/graphql`,
    headers: headers as any,
  });

  const link = ApolloLink.from([errorLink, authLink.concat(httpLink)]);

  if (!apolloClient || typeof window === 'undefined') {
    apolloClient = new ApolloClient({
      link,
      cache: apolloCache,
    });
  }

  return apolloClient;
};

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
  headers?: IncomingHttpHeaders | null;
  initialState?: InitialState | null;
}

export const initializeApollo = (
  { headers, initialState }: IInitializeApollo = {
    headers: null,
    initialState: null,
  },
) => {
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps'],
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
};

export function useApollo(pageProps: AppProps['pageProps']) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo({ initialState: state }), [state]);
  return store;
}

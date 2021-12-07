import React from 'react';
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading, Notifications } from "expo";
import * as Font from 'expo-font';
import {Asset} from 'expo-asset';
import { AsyncStorage } from "react-native";
import { Alert } from "react-native";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
// import ApolloClient from "apollo-boost";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "react-apollo-hooks";
import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split, Observable } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import firebase from 'firebase';
import firebaseConfig from "./firebase.config";
//AsyncStorage.clear();


if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

    

  const preLoad = async () => {
    //await AsyncStorage.clear();
    try {
      await Font.loadAsync({
        ...Ionicons.font
      });
      
      await Font.loadAsync({'elli':require('./assets/fonts/TmonMonsori.ttf'), 'korElli' :require('./assets/fonts/TmonMonsori.ttf')}); 
      const cache = new InMemoryCache();
      const httpLink = new HttpLink({
        //uri: 'http://192.168.0.135:4000/'
      uri: 'http://13.125.147.101:4000/'
        // uri: 'http://15.165.108.181:4000/'
        //uri: 'http://172.20.10.2:4000/'

      });
      const wsLink = new WebSocketLink({
        // uri: 'http://192.168.0.135:4000/',
        uri: `ws://13.125.147.101:4000/`,
        // uri: `ws://15.165.108.181:4000/`,
        //uri: 'http://172.20.10.2:4000/',
        options: {
            reconnect: true
        }
      });

      const request = async operation => {
        const token = await AsyncStorage.getItem('jwt');
        //console.log(token);
        operation.setContext({
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
      };

      
      const requestLink = new ApolloLink((operation, forward) =>
        new Observable(observer => {
          let handle;
          Promise.resolve(operation)
            .then(oper => request(oper))
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(observer.error.bind(observer));
      
          return () => {
            if (handle) handle.unsubscribe();
          };
        })
      );      

      await persistCache({
        cache,
        storage: AsyncStorage
      });
      // const client = new ApolloClient({
      //   cache,
      //   request: async operation=>{//request는 매요청마다 가로채서 토큰을 가져온다.
      //     const token = await AsyncStorage.getItem("jwt");
          
      //     return operation.setContext({
      //       headers: { Authorization: `Bearer ${token}`}
      //     });
      //   },
      //   ...apolloClientOptions
      // });

      const client = new ApolloClient({
        link: ApolloLink.from([
          onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
              graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
              );
            if (networkError) console.log(`[Network error]: ${networkError}`);
          }),
          requestLink,
          split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
              );
            },
            wsLink,
            httpLink
          )
        ]),
        cache
      });


      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoaded(true);
      setClient(client);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
    
  }, []);
  console.disableYellowBox = true

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
      <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}

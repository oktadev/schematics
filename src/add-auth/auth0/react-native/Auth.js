/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Auth0 from 'react-native-auth0';

const authConfig = require('./auth.config');
const auth0 = new Auth0(authConfig);

const Auth = () => {

  let [accessToken, setAccessToken] = useState(null);

  const onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email'
      })
      .then(response => {
        Alert.alert('AccessToken: ' + response.accessToken);
        setAccessToken(response.accessToken);
      })
      .catch(error => console.log(error));
  };

  const onLogout = () => {
    auth0.webAuth
      .clearSession({})
      .then(success => {
        Alert.alert('Logged out!');
        setAccessToken(null);
      })
      .catch(error => {
        console.log('Log out cancelled');
      });
  };

  let loggedIn = accessToken !== null;
  return (
    <View style={styles.container}>
      <Text>You are{loggedIn ? ' ' : ' not '}logged in. </Text>
      <Button onPress={loggedIn ? onLogout : onLogin}
              title={loggedIn ? 'Log Out' : 'Log In'} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});

export default Auth;

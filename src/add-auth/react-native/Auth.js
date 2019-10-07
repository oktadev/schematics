import React, { Component, Fragment } from 'react';

import { SafeAreaView, ScrollView, Button, StyleSheet, Text, View } from 'react-native';
import { createConfig, signIn, signOut, isAuthenticated, getUser, getUserFromIdToken, EventEmitter } from '@okta/okta-react-native';
import configFile from './auth.config';

export default class Auth extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      context: null,
    };
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  async componentDidMount() {
    let that = this;
    EventEmitter.addListener('signInSuccess', function (e: Event) {
      that.setState({authenticated: true});
      that.setContext('Logged in!');
    });
    EventEmitter.addListener('signOutSuccess', function (e: Event) {
      that.setState({authenticated: false});
      that.setContext('Logged out!');
    });
    EventEmitter.addListener('onError', function (e: Event) {
      console.warn(e);
      that.setContext(e.error_message);
    });
    EventEmitter.addListener('onCancelled', function (e: Event) {
      console.warn(e);
    });
    await createConfig({
      clientId: configFile.oidc.clientId,
      redirectUri: configFile.oidc.redirectUri,
      endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
      discoveryUri: configFile.oidc.discoveryUri,
      scopes: configFile.oidc.scopes,
      requireHardwareBackedKeyStore: configFile.oidc.requireHardwareBackedKeyStore,
    });
    this.checkAuthentication();
  }

  componentWillUnmount() {
    EventEmitter.removeAllListeners('signInSuccess');
    EventEmitter.removeAllListeners('signOutSuccess');
    EventEmitter.removeAllListeners('onError');
    EventEmitter.removeAllListeners('onCancelled');
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const result = await isAuthenticated();
    if (result.authenticated !== this.state.authenticated) {
      this.setState({authenticated: result.authenticated});
    }
  }

  async login() {
    signIn();
  }

  async logout() {
    signOut();
  }

  async getUserIdToken() {
    let user = await getUserFromIdToken();
    this.setContext(JSON.stringify(user, null, 2));
  }

  async getMyUser() {
    let user = await getUser();
    this.setContext(JSON.stringify(user, null, 2));
  }

  setContext = message => {
    this.setState({
      context: message,
    });
  };

  renderButtons() {
    if (this.state.authenticated) {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              onPress={async () => {
                this.getUserIdToken();
              }}
              title="Get User From Id Token"
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={async () => {
                this.getMyUser();
              }}
              title="Get User From Request"
            />
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.container}>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              {this.state.authenticated ? (
                <Button
                  style={styles.button}
                  testID="logoutButton"
                  onPress={async () => { this.logout() }}
                  title="Logout"
                />
              ) : (
                <Button
                  style={styles.button}
                  testID="loginButton"
                  onPress={async () => { this.login() }}
                  title="Login"
                />
              )}
            </View>
          </View>
          {this.renderButtons()}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.context}>
            <Text>{this.state.context}</Text>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    width: 300,
    height: 40,
    marginTop: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  }
});

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, OktaAuthOptions, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';

const config: OktaAuthOptions = {
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback'
};
const oktaAuth = new OktaAuth(config);

class App extends Component {
  restoreOriginalUri: any;

  constructor(props: any) {
    super(props);
    this.restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/callback" component={LoginCallback}/>
      </Security>
    );
  }
}

// @ts-ignore
const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';

const config = {
  issuer: '<%= issuer %>',
  redirect_uri: window.location.origin + '/callback',
  client_id: '<%= clientId %>'
};
const oktaAuth = new OktaAuth(config);

class App extends Component {

  render() {
    return (
      <Router>
        <Security oktaAuth={oktaAuth}>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/callback" component={LoginCallback}/>
        </Security>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';

const oktaAuth = new OktaAuth({
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback'
});

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

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';

const oktaAuth = new OktaAuth({
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback'
});

class App extends Component {

  const history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  render() {
    return (
      <Router>
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/callback" component={LoginCallback}/>
        </Security>
      </Router>
    );
  }
}

export default App;

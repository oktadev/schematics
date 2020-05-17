import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LoginCallback, Security } from '@okta/okta-react';
import Home from './Home';

const config = {
  issuer: '<%= issuer %>',
  redirect_uri: window.location.origin + '/callback',
  client_id: '<%= clientId %>'
};

class App extends Component {

  render() {
    return (
      <Router>
        <Security {...config}>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/callback" component={LoginCallback}/>
        </Security>
      </Router>
    );
  }
}

export default App;

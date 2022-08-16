import React  from 'react';

import { useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import Routes from './Routes';

const oktaAuth = new OktaAuth({
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback'
});

const App = () => {
  const navigate = useNavigate();
  const restoreOriginalUri = (_oktaAuth,  originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes />
    </Security>
  );
}

export default App;

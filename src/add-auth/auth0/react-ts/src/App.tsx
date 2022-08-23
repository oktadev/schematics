import React from 'react';

import { Auth0Provider } from '@auth0/auth0-react';
import Routes from './Routes';

const App = () => {
  return (
    <Auth0Provider domain="<%= issuer %>" clientId="<%= clientId %>"
      redirectUri={window.location.origin}>
      <Routes/>
    </Auth0Provider>
  );
}

export default App;

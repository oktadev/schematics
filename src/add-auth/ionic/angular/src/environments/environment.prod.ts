import type { IAuthConfig } from 'ionic-appauth';

const oidcConfig: IAuthConfig = {
  client_id: '<%= clientId %>',
  server_host: '<%= issuer %>',
  redirect_url: window.location.origin + '/callback',
  end_session_redirect_url: window.location.origin + '/logout',
  scopes: 'openid profile',
  pkce: true,
};

export const environment = {
  production: false,
  oidcConfig,
  audience: '<% if (auth0) { %><%= issuer %>/api/v2/<% } else { %>api://default<% } %>',
  scheme: '<%= packageName %>',
};

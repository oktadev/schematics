export default {
  oidc: {
    clientId: '<%= clientId %>',
    redirectUri: '<%= packageName %>:/callback',
    endSessionRedirectUri: '<%= packageName %>:/logout',
    discoveryUri: '<%= issuer %>',
    scopes: ['openid', 'profile', 'offline_access'],
    requireHardwareBackedKeyStore: false,
  },
};

export default {
  oidc: {
    clientId: '<%= clientId %>',
    redirectUri: '<%= packageName %>:/callback',
    endSessionRedirectUri: '<%= packageName %>:/callback',
    discoveryUri: '<%= issuer %>',
    scopes: ['openid', 'profile', 'offline_access'],
    requireHardwareBackedKeyStore: false,
  },
};

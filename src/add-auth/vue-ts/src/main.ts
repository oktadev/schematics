import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaVue from '@okta/okta-vue';

const config = {
  issuer: '<%= issuer %>',
  redirectUri: window.location.origin + '/callback',
  clientId: '<%= clientId %>',
  scopes: ['openid', 'profile', 'email']
};

const oktaAuth = new OktaAuth(config);

createApp(App)
  .use(router)
  .use(OktaVue, {oktaAuth})
  .mount('#app');

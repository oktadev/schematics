import { ApplicationConfig<% if (errorListeners) { %>, provideBrowserGlobalErrorListeners<% } %> } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideOktaAuth, withOktaConfig } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

const oktaConfig = {
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: '/callback',
  scopes: ['openid', 'profile']
};

const oktaAuth = new OktaAuth(oktaConfig);

export const appConfig: ApplicationConfig = {
  providers: [
<% if (errorListeners) { %>    provideBrowserGlobalErrorListeners(),
<% } %>    provideOktaAuth(withOktaConfig({ oktaAuth })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes)
  ]
};

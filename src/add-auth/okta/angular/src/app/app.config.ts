import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { OktaAuthModule } from '@okta/okta-angular';
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
    importProvidersFrom(
      OktaAuthModule.forRoot({oktaAuth})
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes)
  ]
};

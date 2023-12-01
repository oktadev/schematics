import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';

const config = {
  domain: '<%= issuer %>',
  clientId: '<%= clientId %>',
  authorizationParams: {
    redirect_uri: window.location.origin + '/home',
  },
  httpInterceptor: {
    allowedList: ['/api/*']
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideRouter(routes),
    provideAuth0(config)
  ]
};

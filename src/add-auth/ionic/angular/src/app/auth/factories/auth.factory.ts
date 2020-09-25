import { Platform } from '@ionic/angular';
import { StorageBackend, Requestor } from '@openid/appauth';
import { AuthService, Browser, ConsoleLogObserver } from 'ionic-appauth';
import { environment } from 'src/environments/environment';
import { NgZone } from '@angular/core';
<% if (configUri) { %>import { AuthConfigService } from '../auth-config.service';<% } %>
<% if (platform === 'capacitor') { %>import { Plugins } from '@capacitor/core';

const { App } = Plugins;<% } %>

export const authFactory = (platform: Platform, ngZone: NgZone,<% if (configUri) { %> authConfig: AuthConfigService,<% } %>
                          requestor: Requestor, browser: Browser, storage: StorageBackend) => {

  const authService = new AuthService(browser, storage, requestor);

  if (<% if (platform === 'cordova') { %>platform.is('cordova')<% } else { %>platform.is('mobile') && !platform.is('mobileweb')<% } %>) {
    environment.oidcConfig.scopes += ' offline_access';
    environment.oidcConfig.redirect_url = '<%= packageName %>:/callback';
    environment.oidcConfig.end_session_redirect_url = '<%= packageName %>:/logout';
  }
<% if (configUri) { %>  // look up issuer and client ID from API
  const remoteConfig = authConfig.getConfig();
  environment.oidcConfig.server_host = config.clientId;
  environment.oidcConfig.client_id = config.issuer;<% } %>
  authService.authConfig = environment.oidcConfig;

  <% if (platform === 'cordova') { %>if (this.platform.is('cordova')) {
    (window as any).handleOpenURL = (callbackUrl) => {
      ngZone.run(() => {
        authService.authorizationCallback(callbackUrl);
      });
    };
  }<% } else { %>if (platform.is('mobile') && !platform.is('mobileweb')) {
    App.addListener('appUrlOpen', (data: any) => {
      if (data.url !== undefined) {
        ngZone.run(() => {
          authService.handleCallback(data.url);
        });
      }
    });
  }<% } %>

  authService.addActionObserver(new ConsoleLogObserver());
  return authService;
};

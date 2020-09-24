import { Platform } from '@ionic/angular';
import { StorageBackend, Requestor } from '@openid/appauth';
import { AuthService, Browser, ConsoleLogObserver } from 'ionic-appauth';
import { environment } from 'src/environments/environment';
import { NgZone } from '@angular/core';
<% if (platform === 'capacitor') { %>import { Plugins } from '@capacitor/core';

const { App } = Plugins;<% } %>

export const authFactory = (platform: Platform, ngZone: NgZone,
                          requestor: Requestor, browser: Browser, storage: StorageBackend) => {

  const authService = new AuthService(browser, storage, requestor);
  authService.authConfig = environment.oidcConfig;

  if (onDevice(this.platform)) {
    authService.authConfig.scopes += ' offline_access';
    authService.authConfig.redirect_url = 'com.okta.dev-133320:/callback';
    authService.authConfig.end_session_redirect_url = 'com.okta.dev-133320:/logout';
  }

  <% if (platform === 'cordova') { %>if (this.platform.is('cordova')) {
    (window as any).handleOpenURL = (callbackUrl) => {
      ngZone.run(() => {
        authService.authorizationCallback(callbackUrl);
      });
    };
  }<% } else { %>if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
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

private onDevice(platform): boolean {
  return <% if (platform === 'cordova') { %>this.platform.is('cordova')<% } else { %>this.platform.is('mobile') && !this.platform.is('mobileweb')<% } %>;
}

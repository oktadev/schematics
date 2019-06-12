import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
import { IonicAuth, IonicAuthorizationRequestHandler } from 'ionic-appauth';
import { BrowserService } from './browser.service';
import { CordovaRequestorService } from './cordova-requestor.service';
import { SecureStorageService } from './secure-storage.service';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';
<% if (platform === 'capacitor') { %>import { Plugins, AppUrlOpen } from '@capacitor/core';

const { App } = Plugins;<% } %>
<% if (configUri) { %>interface AuthConfig {
  issuer: string;
  clientId: string;
}<% } %>

@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth {

  constructor(requestor: RequestorService, cordovaRequestor: CordovaRequestorService,
              storage: StorageService, secureStorage: SecureStorageService, browser: BrowserService,
              private platform: Platform, private ngZone: NgZone) {<% if (platform === 'cordova') { %>
      super((platform.is('cordova')) ? browser : undefined,
        (platform.is('cordova')) ? secureStorage : storage,
        (platform.is('cordova')) ? cordovaRequestor : requestor);<% } else { %>
      super((platform.is('mobile') && !platform.is('mobileweb')) ? browser : undefined,
        (platform.is('mobile') && !platform.is('mobileweb')) ? secureStorage : storage,
        (platform.is('mobile') && !platform.is('mobileweb')) ? cordovaRequestor : requestor,
        undefined, undefined,
        (platform.is('mobile') && !platform.is('mobileweb')) ?
          new IonicAuthorizationRequestHandler(browser, secureStorage) :
          new IonicAuthorizationRequestHandler(browser, storage)
      );<% } %>

    this.addConfig();
  }

  public async startUpAsync() {
    <% if (platform === 'cordova') { %>if (this.platform.is('cordova')) {
      (<any>window).handleOpenURL = (callbackUrl) => {
        this.ngZone.run(() => {
          this.handleCallback(callbackUrl);
        });
      };
    }<% } else { %>if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
      App.addListener('appUrlOpen', (data: AppUrlOpen) => {
        this.ngZone.run(() => {
          this.handleCallback(data.url);
        });
      });
    }<% } %>

    super.startUpAsync();
  }

  private onDevice(): boolean {
    return <% if (platform === 'cordova') { %>this.platform.is('cordova')<% } else { %>this.platform.is('mobile') && !this.platform.is('mobileweb')<% } %>;
  }

  private async addConfig() {
    const scopes = 'openid profile offline_access';
    const redirectUri = this.onDevice() ? '<%= packageName %>:/callback' : 'http://localhost:8100/implicit/callback';
    const logoutRedirectUri = this.onDevice() ? '<%= packageName %>:/logout' : 'http://localhost:8100/implicit/logout';
    <% if (configUri) { %>const AUTH_CONFIG_URI = '<%= configUri %>';

    if (await this.storage.getItem(AUTH_CONFIG_URI)) {
      this.authConfig = JSON.parse(await this.storage.getItem(AUTH_CONFIG_URI));
      await this.storage.removeItem(AUTH_CONFIG_URI);
    } else {
      // try to get the oauth settings from the server
      this.requestor.xhr({method: 'GET', url: AUTH_CONFIG_URI}).then(async (data: any) => {
        this.authConfig = {
          identity_client: data.clientId,
          identity_server: data.issuer,
          redirect_url: redirectUri,
          end_session_redirect_url: logoutRedirectUri,
          scopes,
          usePkce: true
        };
        await this.storage.setItem(AUTH_CONFIG_URI, JSON.stringify(this.authConfig));
      }, error => {
        console.error('ERROR fetching authentication information, defaulting to Keycloak settings');
        console.error(error);
        this.authConfig = {
          identity_client: 'web_app',
          identity_server: 'http://localhost:9080/auth/realms/jhipster',
          redirect_url: redirectUri,
          end_session_redirect_url: logoutRedirectUri,
          scopes,
          usePkce: true
        };
      });
    }<% } else { %>const clientId = '<%= clientId %>';
    const issuer = '<%= issuer %>';
    const authConfig: any = {
      identity_client: clientId,
      identity_server: issuer,
      redirect_url: redirectUri,
      end_session_redirect_url: logoutRedirectUri,
      scopes,
      usePkce: true,
    };

    this.authConfig = {...authConfig};<% } %>
  }

  private handleCallback(callbackUrl: string): void {
    if ((callbackUrl).indexOf(this.authConfig.redirect_url) === 0) {
      this.AuthorizationCallBack(callbackUrl).catch((error: string) => {
        console.error(`Authorization callback failed! ${error}`);
      });
    }

    if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0) {
      this.EndSessionCallBack().catch((error: string) => {
        console.error(`End session callback failed! ${error}`);
      });
    }
  }
}

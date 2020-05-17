import { Requestor, StorageBackend } from '@openid/appauth';
import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
import { IonicAuth, Browser} from 'ionic-appauth';
import { environment } from '../../environments/environment';
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

  constructor(requestor: Requestor,
              storage: StorageBackend,
              browser: Browser,
              private platform: Platform,
              private ngZone: NgZone) {
    super(browser, storage, requestor);

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
    const scopes = 'openid profile' + (this.onDevice() ? ' offline_access' : '');
    const redirectUri = this.onDevice() ? '<%= packageName %>:/callback' : window.location.origin + '/callback';
    const logoutRedirectUri = this.onDevice() ? '<%= packageName %>:/logout' : window.location.origin + '/logout';
    <% if (configUri) { %>const AUTH_CONFIG_URI = `${environment.apiUrl}/<%= configUri %>`;

    if (await this.storage.getItem(AUTH_CONFIG_URI)) {
      this.authConfig = JSON.parse(await this.storage.getItem(AUTH_CONFIG_URI));
      await this.storage.removeItem(AUTH_CONFIG_URI);
    } else {
      // try to get the OIDC settings from the server
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

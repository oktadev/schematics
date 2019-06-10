import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
<% if (configUri) { %>import { HttpClient } from '@angular/common/http';<% } %>
import { IonicAuth, IonicAuthorizationRequestHandler } from 'ionic-appauth';
import { BrowserService } from './browser.service';
import { CordovaRequestorService } from './cordova-requestor.service';
import { SecureStorageService } from './secure-storage.service';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';
<% if (platform === 'capacitor') { %>import { Plugins, AppUrlOpen } from '@capacitor/core';

const { App } = Plugins;<% } %>
<% if (configUri) { %>
interface AuthConfig {
  issuer: string;
  clientId: string;
}<% } %>

@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth {

  constructor(requestor: RequestorService, cordovaRequestor: CordovaRequestorService,
              storage: StorageService, secureStorage: SecureStorageService, browser: BrowserService,
              private platform: Platform, private ngZone: NgZone<% if (configUri) { %>, private http: HttpClient<% } %>) {<% if (platform === 'cordova') { %>
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

  private addConfig() {
    const scopes = 'openid profile offline_access';
  <% if (configUri) { %>
    const AUTH_CONFIG: string = '<%= configUri %>';
    if (localStorage.getItem(AUTH_CONFIG)) {
      this.authConfig = JSON.parse(localStorage.getItem(AUTH_CONFIG));
      localStorage.removeItem(AUTH_CONFIG);
    } else {
      // try to get the oauth settings from the server
      this.http.get(AUTH_CONFIG).subscribe((data: any) => {
        this.authConfig = {
          identity_client: data.clientId,
          identity_server: data.issuer,
          // todo: change localhost to production URL before deploying
          redirect_url: this.onDevice() ? '<%= packageName %>:/callback' : 'http://localhost:8100/implicit/callback',
          scopes,
          usePkce: true,
          response_type: 'code',
          end_session_redirect_url: this.onDevice() ? '<%= packageName %>:/logout' : 'http://localhost:8100/implicit/logout'
        };
        localStorage.setItem(AUTH_CONFIG, JSON.stringify(this.authConfig));
      });
  <% } else { %>
    const clientId = '<%= clientId %>';
    const issuer = '<%= issuer %>';
    const authConfig: any = {
      identity_client: clientId,
      identity_server: issuer,
      scopes,
      usePkce: true,
    };

    if (this.onDevice()) {
      authConfig.redirect_url = 'com.oktapreview.dev-737523:/callback';
      authConfig.end_session_redirect_url = 'com.oktapreview.dev-737523:/logout';
    } else {
      authConfig.redirect_url = 'http://localhost:8100/implicit/callback';
      authConfig.end_session_redirect_url = 'http://localhost:8100/implicit/logout';
    }

    this.authConfig = {...authConfig};
  <% } %>
    }
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

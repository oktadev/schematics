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

  private addConfig() {
    const clientId = '<%= clientId %>';
    const issuer = '<%= issuer %>';
    const scopes = 'openid profile offline_access';

    if (<% if (platform === 'cordova') { %>this.platform.is('cordova')<% } else { %>this.platform.is('mobile') && !this.platform.is('mobileweb')<% } %>) {
      this.authConfig = {
        identity_client: clientId,
        identity_server: issuer,
        redirect_url: '<%= packageName %>:/callback',
        scopes: scopes,
        usePkce: true,
        end_session_redirect_url: '<%= packageName %>:/logout',
      };
    } else {
      this.authConfig = {
        identity_client: clientId,
        identity_server: issuer,
        redirect_url: 'http://localhost:8100/implicit/callback',
        scopes: scopes,
        usePkce: true,
        response_type: 'code',
        end_session_redirect_url: 'http://localhost:8100/implicit/logout',
      };
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

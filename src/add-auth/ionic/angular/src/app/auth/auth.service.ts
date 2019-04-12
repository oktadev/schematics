import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
import { map, skipWhile, take } from 'rxjs/operators';

import { AuthActions, IAuthAction, IonicAuth } from 'ionic-appauth';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';
<% if (platform === 'cordova') { %>import { CordovaBrowser, CordovaRequestor, CordovaSecureStorage } from 'ionic-appauth/lib/cordova';
<% } else { %>import { Plugins, AppLaunchUrl } from '@capacitor/core';
import { CapacitorBrowser, CapacitorStorage } from 'ionic-appauth/lib/capacitor';

const { App } = Plugins;<% } %>

@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth {

  constructor(requestor: RequestorService, storage: StorageService,
              private platform: Platform, private ngZone: NgZone) {<% if (platform === 'cordova') { %>
      super((platform.is('cordova')) ? new CordovaBrowser() : undefined,
        (platform.is('cordova')) ? new CordovaSecureStorage() : storage,
        (platform.is('cordova')) ? new CordovaRequestor() : requestor);<% } else { %>
      super((platform.is('mobile') && !platform.is('mobileweb')) ? new CapacitorBrowser() : undefined,
        (platform.is('mobile') && !platform.is('mobileweb')) ? new CapacitorStorage() : storage,
        requestor);<% } %>

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
      const appLaunchUrl : AppLaunchUrl = await App.getLaunchUrl();
      if (appLaunchUrl.url !== undefined) {
        this.handleCallback(appLaunchUrl.url);
      }
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
      // todo: don't ignore promise or refactor
      this.AuthorizationCallBack(callbackUrl);
    }

    if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0) {
      this.EndSessionCallBack();
    }
  }

  public isAuthenticated() {
    return this.authObservable
      .pipe(skipWhile(action => action.action === AuthActions.Default),
        take(1),
        map((action: IAuthAction) => action.tokenResponse !== undefined)).toPromise();
  }
}

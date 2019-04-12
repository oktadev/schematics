import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';

import { AuthActions, IAuthAction, IonicAuth } from 'ionic-appauth';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';
import { CordovaBrowser, CordovaRequestor, CordovaSecureStorage } from 'ionic-appauth/lib/cordova';
import { map, skipWhile, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth {

  constructor(requestor: RequestorService, storage: StorageService,
              private platform: Platform, private ngZone: NgZone) {
    super((platform.is('cordova')) ? new CordovaBrowser() : undefined,
      (platform.is('cordova')) ? new CordovaSecureStorage() : storage,
      (platform.is('cordova')) ? new CordovaRequestor() : requestor);

    this.addConfig();
  }

  public async startUpAsync() {
    if (this.platform.is('cordova')) {
      (<any>window).handleOpenURL = (callbackUrl) => {
        this.ngZone.run(() => {
          this.handleCallback(callbackUrl);
        });
      };
    }

    super.startUpAsync();
  }

  private addConfig() {
    const clientId = '<%= clientId %>';
    const issuer = '<%= issuer %>';
    const scopes = 'openid profile offline_access';

    if (this.platform.is('cordova')) {
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

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Requestor, TokenResponse } from '@openid/appauth';

import { AuthService } from './auth.service';
import { CordovaRequestor } from 'ionic-appauth/lib/cordova';
import { RequestorService } from './requestor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  requestor: Requestor;

  constructor(
    angularRequestor: RequestorService,
    cordovaRequestor: CordovaRequestor,
    platform: Platform,
    private auth: AuthService
  ) {
    this.requestor = platform.is('cordova') ? cordovaRequestor : angularRequestor;

  }

  public async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: any) {
    const token: TokenResponse = await this.auth.getValidToken();
    return this.requestor.xhr<T>({
      url: url,
      method: method,
      data: JSON.stringify(body),
      headers: this.addHeaders(token)
    });
  }

  private addHeaders(token) {
    return (token) ? {
      'Authorization': `${token.tokenType} ${token.accessToken}`,
      'Content-Type': 'application/json'
    } : {};

  }
}

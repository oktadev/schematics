import { CordovaRequestor } from 'ionic-appauth/lib/cordova';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
<% if (platform === 'capacitor') { %>/**
 * This service is necessary for Capacitor to workaround CORS limitations in Okta.
 * Capacitor sends an `origin` header of `capacitor://localhost`, which is not an
 * allowed Trusted Origin. This is the workaround recommended by Capacitor:
 * https://ionicframework.com/docs/faq/cors#b-working-around-cors-in-a-server-you-can-t-control
 */<% } %>
export class CordovaRequestorService extends CordovaRequestor {
}

import { Injectable } from '@angular/core';
<% if (platform === 'cordova') { %>import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';<% } else { %>
import { CapacitorStorage } from 'ionic-appauth/lib/capacitor';<% } %>

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService extends <%= (platform === 'cordova') ? 'CordovaSecureStorage' : 'CapacitorStorage' %>{
}

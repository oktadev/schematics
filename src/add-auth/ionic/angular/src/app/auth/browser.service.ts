import { Injectable } from '@angular/core';
<% if (platform === 'cordova') { %>import { CordovaBrowser } from 'ionic-appauth/lib/cordova';<% } else { %>
import { CapacitorBrowser } from 'ionic-appauth/lib/capacitor';<% } %>

@Injectable({
    providedIn: 'root'
})
export class BrowserService extends <%= (platform === 'cordova') ? 'CordovaBrowser' : 'CapacitorBrowser' %> {
}

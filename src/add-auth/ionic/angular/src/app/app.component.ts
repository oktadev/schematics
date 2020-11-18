import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
<% if (platform === 'cordova') { %>import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';<% } else { %>
import { Plugins } from '@capacitor/core';

const { SplashScreen } = Plugins;<% } %>

import { AuthObserver } from 'ionic-appauth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  authObserver: AuthObserver;

  constructor(
    private platform: Platform,<% if (platform === 'cordova') { %>
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,<% } %>
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {<% if (platform === 'cordova') { %>
      this.statusBar.styleDefault();
      this.splashScreen.hide();<% } else { %>
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        SplashScreen.hide();
      }
      <% } %>
    });
  }
}

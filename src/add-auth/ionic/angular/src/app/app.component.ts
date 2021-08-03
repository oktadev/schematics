import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
<% if (platform === 'cordova.addproviderfails') { %>import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';<% } else if (platform === 'capacitor') { %>
import { SplashScreen } from '@capacitor/splash-screen';<% } %>

import { AuthService } from 'ionic-appauth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private auth: AuthService,<% if (platform === 'cordova.addproviderfails') { %>
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,<% } %>
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await this.auth.init();<% if (platform === 'cordova.addproviderfails') { %>
      this.statusBar.styleDefault();
      this.splashScreen.hide();<% } else if (platform === 'capacitor') { %>
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        await SplashScreen.hide();
      }
      <% } %>
    });
  }
}

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
<% if (platform === 'cordova') { %>import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';<% } else { %>
import { Plugins } from '@capacitor/core';

const { SplashScreen } = Plugins;<% } %>

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,<% if (platform === 'cordova') { %>
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,<% } %>
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.startUpAsync();<% if (platform === 'cordova') { %>
      this.statusBar.styleDefault();
      this.splashScreen.hide();<% } else { %>
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        SplashScreen.hide();
      }
      <% } %>
    });
  }
}

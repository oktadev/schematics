import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthActions, AuthObserver, AuthService, IAuthAction } from 'ionic-appauth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  action: IAuthAction;
  observer: AuthObserver;

  constructor(private auth: AuthService, private navCtrl: NavController) {
  }

  async ngOnInit() {
    await this.auth.loadTokenFromStorage();
    this.observer = this.auth.addActionListener((action) => this.onSignInSuccess(action));
  }

  ngOnDestroy() {
    this.auth.removeActionObserver(this.observer);
  }

  async signIn() {
    await this.authService.signIn();
  }

  private onSignInSuccess(action: IAuthAction) {
    this.action = action;
    if (action.action === AuthActions.SignInSuccess ||
      action.action === AuthActions.LoadTokenFromStorageSuccess) {
      this.navCtrl.navigateRoot('tabs');
    }
  }
}

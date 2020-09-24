import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IUserInfo } from '../auth/user-info.model';
import { AuthActions, AuthObserver, AuthService, IAuthAction } from 'ionic-appauth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  userInfo = this.auth.session.user;
  action: IAuthAction;
  loginObserver: AuthObserver;
  logoutObserver: AuthObserver;
  userObserver: AuthObserver;

  constructor(private navCtrl: NavController, private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.loadTokenFromStorage();
    this.loginObserver = this.auth.addActionListener((action) => this.onSignInSuccess(action));
    this.logoutObserver = this.auth.addActionListener((action) => this.onSignOutSuccess(action));
    this.userObserver = this.auth.addActionListener((action) => this.onUserInfoSuccess(action));
  }

  ngOnDestroy() {
    this.auth.removeActionObserver(this.loginObserver);
    this.auth.removeActionObserver(this.logoutObserver);
    this.auth.removeActionObserver(this.userObserver);
  }

  private onSignInSuccess(action: IAuthAction) {
    this.action = action;
  }

  private onUserInfoSuccess(action: IAuthAction): void {
    if (action.action === AuthActions.LoadUserInfoSuccess) {
      this.userInfo = action.user;
    }
  }

  private onSignOutSuccess(action: IAuthAction) {
    this.action = action;

    if (action.action === AuthActions.SignOutSuccess) {
      delete this.action;
    }
  }

  public signOut() {
    this.auth.signOut();
  }

  public signIn() {
    this.auth.signIn().catch(error => console.error(`Sign in error: ${error}`));
  }

  public async getUserInfo(): Promise<void> {
    this.auth.loadUserInfo();
  }

  public async refreshToken(): Promise<void> {
    this.auth.refreshToken();
  }
}

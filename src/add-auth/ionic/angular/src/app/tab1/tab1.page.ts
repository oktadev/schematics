import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthActions, AuthService, IAuthAction } from 'ionic-appauth';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  user$ = this.auth.user$;
  events$ = this.auth.events$;
  sub: Subscription;
  action: IAuthAction;

  constructor(private navCtrl: NavController, private auth: AuthService) {
  }

  ngOnInit() {
    this.sub = this.events$.subscribe((action: IAuthAction) => this.onAction(action));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private onAction(action: IAuthAction) {
    if (action.action === AuthActions.LoadTokenFromStorageFailed ||
      action.action === AuthActions.SignInFailed ||
      action.action === AuthActions.SignOutSuccess) {
      delete this.action;
    } else {
      this.action = action;
    }
  }

  public async signOut() {
    await this.auth.signOut();
  }

  public signIn() {
    this.auth.signIn({ audience: environment.oidcConfig.audience })
      .catch(error => console.error(`Sign in error: ${error}`));
  }

  public async getUserInfo(): Promise<void> {
    await this.auth.loadUserInfo();
  }

  public async refreshToken(): Promise<void> {
    await this.auth.refreshToken();
  }
}

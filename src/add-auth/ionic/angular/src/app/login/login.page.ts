import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthActions, AuthObserver, AuthService, IAuthAction } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

const { audience } = environment;

@Component({
  selector: 'app-home',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  action!: IAuthAction;
  observer!: AuthObserver;
  events$ = this.auth.events$;
  sub!: Subscription;

  constructor(private auth: AuthService, private navCtrl: NavController) {
  }

  async ngOnInit() {
    this.sub = this.events$.subscribe((action: IAuthAction) => this.onSignInSuccess(action));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async signIn() {
    await this.auth.signIn({ audience });
  }

  private onSignInSuccess(action: IAuthAction) {
    this.action = action;
    if (action.action === AuthActions.SignInSuccess ||
      action.action === AuthActions.LoadTokenFromStorageSuccess) {
      this.navCtrl.navigateRoot('tabs');
    }
  }
}

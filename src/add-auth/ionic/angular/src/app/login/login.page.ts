import { Component, OnInit } from '@angular/core';
import { AuthActions, IAuthAction } from 'ionic-appauth';
import { AuthService } from '../auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  action: IAuthAction;

  constructor(private auth: AuthService, private navCtrl: NavController) {
  }

  ngOnInit() {
    this.auth.authObservable.subscribe((action) => {
      this.action = action;
      if (action.action === AuthActions.SignInSuccess) {
        this.navCtrl.navigateRoot('tabs');
      }
    });
  }

  signIn() {
    this.auth.signIn();
  }
}

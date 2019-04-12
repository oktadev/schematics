import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { IUserInfo } from '../auth/user-info.model';
import { AuthActions, IAuthAction } from 'ionic-appauth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  userInfo: IUserInfo;
  action: IAuthAction;

  constructor(private navCtrl: NavController, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.authObservable.subscribe((action) => {
      this.action = action;
      if (action.action === AuthActions.SignOutSuccess) {
        this.navCtrl.navigateRoot('login');
      }
    });
  }

  signOut() {
    this.authService.signOut();
  }

  public async getUserInfo(): Promise<void> {
    this.userInfo = await this.authService.getUserInfo<IUserInfo>();
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthServiceCordova } from '../../../../../cordova/auth.service';

@Component({
  template: '<p>Signing Out...</p>'
})
export class EndSessionPage implements OnInit {

  constructor(
    private authService: AuthServiceCordova,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.authService.EndSessionCallBack();
    this.navCtrl.navigateRoot('login');
  }

}

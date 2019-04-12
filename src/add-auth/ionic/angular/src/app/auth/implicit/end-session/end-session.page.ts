import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from './../../auth.service';

@Component({
  template: '<p>Signing Out...</p>'
})
export class EndSessionPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.authService.EndSessionCallBack();
    this.navCtrl.navigateRoot('login');
  }

}

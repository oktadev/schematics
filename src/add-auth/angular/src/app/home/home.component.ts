import { Component } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.<%= style %>']
})
export class HomeComponent {

  constructor(public oktaAuth: OktaAuth, public authService: OktaAuthStateService) {
  }
}

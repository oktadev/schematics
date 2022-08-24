import { Component, Inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.<%= style %>']
})
export class HomeComponent {

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, public authService: OktaAuthStateService) {
  }
}

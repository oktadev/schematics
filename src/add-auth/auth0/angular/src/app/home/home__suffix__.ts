import { Component, inject } from '@angular/core';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe],
  templateUrl: './home<%= suffix %>.html',
  styleUrl: './home<%= suffix %>.<%= style %>'
})
export class <%= homeClass %> {
  protected readonly auth = inject(AuthService);
  private readonly doc = inject(DOCUMENT);

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}

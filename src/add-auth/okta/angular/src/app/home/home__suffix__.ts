import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe],
  templateUrl: './home<%= suffix %>.html',
  styleUrl: './home<%= suffix %>.<%= style %>'
})
export class <%= homeClass %> {
  private readonly oktaStateService = inject(OktaAuthStateService);
  private readonly oktaAuth = inject(OKTA_AUTH);

  protected readonly isAuthenticated$ = this.oktaStateService.authState$.pipe(
    filter((s: AuthState) => !!s),
    map((s: AuthState) => s.isAuthenticated ?? false)
  );

  async login(): Promise<void> {
    await this.oktaAuth.signInWithRedirect();
  }

  async logout(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}

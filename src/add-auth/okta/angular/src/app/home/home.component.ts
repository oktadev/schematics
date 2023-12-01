import { Component, inject } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';
import { Observable, filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.<%= style %>']
})
export class HomeComponent {
  public isAuthenticated$!: Observable<boolean>;
  private oktaStateService = inject(OktaAuthStateService);
  private oktaAuth = inject(OKTA_AUTH);

  public ngOnInit(): void {
    this.isAuthenticated$ = this.oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );
  }

  public async login() : Promise<void> {
    await this.oktaAuth.signInWithRedirect();
  }

  public async logout(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}

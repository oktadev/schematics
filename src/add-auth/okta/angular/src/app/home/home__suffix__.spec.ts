import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';
import { of } from 'rxjs';
import { <%= homeClass %> } from './home<%= suffix %>';

describe('<%= homeClass %>', () => {
  let component: <%= homeClass %>;
  let fixture: ComponentFixture<<%= homeClass %>>;

  const authState: AuthState = { isAuthenticated: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<%= homeClass %>],
      providers: [
        { provide: OktaAuthStateService, useValue: { authState$: of(authState) } },
        { provide: OKTA_AUTH, useValue: { signInWithRedirect: () => Promise.resolve(), signOut: () => Promise.resolve() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(<%= homeClass %>);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a login button when not authenticated', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#login')).toBeTruthy();
  });
});

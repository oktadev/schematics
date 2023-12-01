import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState, IDToken } from '@okta/okta-auth-js';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let oktaAuthSpy: unknown;

  const idToken: IDToken = {
    idToken: 'token',
    clientId: 'client',
    issuer: 'issuer',
    authorizeUrl: 'authorize',
    expiresAt: 123,
    scopes: [],
    claims: {
      sub: 'sub',
      name: 'Test Name'
    }
  };

  const authState: AuthState = {
    isAuthenticated: true,
    idToken
  };

  let oktaStateSpy = jasmine.createSpyObj<OktaAuthStateService>([],['authState$']);

  beforeEach(async () => {
    oktaAuthSpy = jasmine.createSpyObj('OktaAuth', ['signInWithRedirect']);
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: OktaAuthStateService,
          useValue: oktaStateSpy,
        },
        {
          provide: OKTA_AUTH,
          useValue: oktaAuthSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    (Object.getOwnPropertyDescriptor(oktaStateSpy, 'authState$')?.get as jasmine.Spy).and.returnValue(of(authState));
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { <%= homeClass %> } from './home<%= suffix %>';

describe('<%= homeClass %>', () => {
  let component: <%= homeClass %>;
  let fixture: ComponentFixture<<%= homeClass %>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<%= homeClass %>],
      providers: [
        {
          provide: AuthService,
          useValue: { isAuthenticated$: of(false), loginWithRedirect: () => {}, logout: () => {} },
        },
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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Platform } from '@ionic/angular';<% if (platform === 'cordova') { %>
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';<% } %>
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';

describe('AppComponent', () => {

  let <% if (platform === 'cordova') { %>statusBarSpy, splashScreenSpy, <% } %>platformReadySpy, platformIsSpy, platformSpy;

  beforeEach(async(() => {
    <% if (platform === 'cordova') { %>statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);<% } %>
    platformReadySpy = Promise.resolve();
    platformIsSpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy, is: platformIsSpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, AuthModule],
      providers: [<% if (platform === 'cordova') { %>{ provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },<% } %>
        { provide: Platform, useValue: platformSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;<% if (platform === 'cordova') { %>expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();<% } %>
  });

  // TODO: add more tests!

});

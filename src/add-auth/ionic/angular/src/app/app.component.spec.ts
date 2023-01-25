import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';

describe('AppComponent', () => {

  let platformReadySpy: Promise<void>, platformIsSpy, platformSpy: { ready: any; };

  beforeEach(waitForAsync(() => {
    platformReadySpy = Promise.resolve();
    platformIsSpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy, is: platformIsSpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, AuthModule],
      providers: [
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
    await platformReadySpy;
  });

  // TODO: add more tests!

});

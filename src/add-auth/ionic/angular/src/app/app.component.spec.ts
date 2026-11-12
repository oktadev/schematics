import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular/lazy';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {

  let readyCalled: boolean;

  beforeEach(async () => {
    readyCalled = false;
    const platform = {
      ready: () => {
        readyCalled = true;
        return Promise.resolve('dom');
      },
      is: () => false,
      // NavController subscribes to the back button
      backButton: { subscribeWithPriority: () => ({ unsubscribe: () => undefined }) },
    };

    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: Platform, useValue: platform },
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', () => {
    TestBed.createComponent(AppComponent);
    expect(readyCalled).toBe(true);
  });

  // TODO: add more tests!

});

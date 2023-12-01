import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OktaCallbackComponent } from '@okta/okta-angular';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: OktaCallbackComponent
  }
];

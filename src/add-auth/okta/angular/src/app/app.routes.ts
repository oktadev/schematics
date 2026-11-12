import { Routes } from '@angular/router';
import { <%= homeClass %> } from './home/home<%= suffix %>';
import { OktaCallbackComponent } from '@okta/okta-angular';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: <%= homeClass %>
  },
  {
    path: 'callback',
    component: OktaCallbackComponent
  }
];

import { Routes } from '@angular/router';
import { <%= homeClass %> } from './home/home<%= suffix %>';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: <%= homeClass %>
  }
];

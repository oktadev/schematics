import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'callback', loadChildren: () => import('./auth/auth-callback/auth-callback.module').then(m => m.AuthCallbackPageModule) },
  { path: 'logout', loadChildren: () => import('./auth/end-session/end-session.module').then(m => m.EndSessionPageModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

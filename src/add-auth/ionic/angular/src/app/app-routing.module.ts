import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'callback', loadChildren: './auth/auth-callback/auth-callback.module#AuthCallbackPageModule' },
  { path: 'logout', loadChildren: './auth/end-session/end-session.module#EndSessionPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

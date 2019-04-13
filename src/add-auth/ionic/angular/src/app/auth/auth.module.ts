import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { AuthHttpService } from './auth-http.service';
import { AuthGuardService } from './auth-guard.service';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    RequestorService,
    StorageService,
    AuthGuardService,
    AuthHttpService,
    AuthService
  ]
})
export class AuthModule {
}

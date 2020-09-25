import { Requestor, StorageBackend } from '@openid/appauth';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { authFactory, browserFactory, httpFactory, storageFactory } from './factories';
import { Browser } from 'ionic-appauth';
<% if (configUri) { %>import { AuthConfigService } from './auth-config.service';

const authInitializer = (authConfig: AuthConfigService) => {
  return () => {
    return authConfig.loadAuthConfig();
  };
};<% } %>

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: StorageBackend,
      useFactory: storageFactory,
      deps: [Platform]
    },
    {
      provide: Requestor,
      useFactory: httpFactory,
      deps: [Platform, HttpClient]
    },
    {
      provide: Browser,
      useFactory: browserFactory,
      deps: [Platform]
    }<% if (configUri) { %>,
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      multi: true,
      deps: [AuthConfigService]
    }<% } %>
  ]
})
export class AuthModule { }

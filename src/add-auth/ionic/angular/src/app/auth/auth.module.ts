import { Requestor, StorageBackend } from '@openid/appauth';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { browserFactory, httpFactory, storageFactory } from './factories';
import { Browser } from 'ionic-appauth';

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
    }
  ]
})
export class AuthModule {
}

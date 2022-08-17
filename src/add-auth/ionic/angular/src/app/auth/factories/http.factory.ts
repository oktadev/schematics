import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { NgHttpService } from '../ng-http.service';

export const httpFactory = (httpClient: HttpClient) => {
  return new NgHttpService(httpClient);
};

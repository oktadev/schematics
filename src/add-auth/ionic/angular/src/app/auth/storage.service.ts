import { Injectable } from '@angular/core';
import { StorageBackend } from '@openid/appauth';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageBackend {

  constructor(private storage: Storage) {
  }

  getItem(name: string): Promise<string> {
    return this.storage.get(name);
  }

  removeItem(name: string): Promise<void> {
    return this.storage.remove(name);
  }

  clear(): Promise<void> {
    return this.storage.clear();
  }

  setItem(name: string, value: string): Promise<void> {
    return this.storage.set(name, value);
  }
}

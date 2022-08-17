import { Platform } from '@ionic/angular';
import { CapacitorStorage } from 'ionic-appauth/lib/capacitor';

export let storageFactory = () => {
  return new CapacitorStorage();
};

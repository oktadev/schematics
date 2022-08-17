import { Platform } from '@ionic/angular';
import { CapacitorBrowser } from 'ionic-appauth/lib/capacitor';

export const browserFactory = () => {
  return new CapacitorBrowser();
};

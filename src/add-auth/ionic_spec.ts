import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './ionic-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

const defaultAppModule: string = `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule, AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}`;

const existingPlugins = {
  plugins: {
    "cordova-plugin-camera": {
      "CAMERA_USAGE_DESCRIPTION": "Need camera access to take pictures",
      "PHOTOLIBRARY_USAGE_DESCRIPTION": "Need photo library access to get pictures from there"
    }
  }
};

describe('OktaDev Schematics: Ionic/Angular', () => {
  it('requires required issuer option', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const schematic = await runner.runSchematicAsync('add-auth', {}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });

  it('works with cordova', async() => {
    const tree = new UnitTestTree(new HostTree);
    const pkg: any = {...packageJson};
    pkg.cordova = {...existingPlugins};

    // Add package.json
    tree.create('/package.json', JSON.stringify(pkg));
    // Add app.module.ts
    tree.create('/src/app/app.module.ts', defaultAppModule);

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematicAsync('add-auth', {...defaultOptions}, tree).toPromise();

    expect(tree.files.length).toEqual(27);
    expect(tree.files.sort()).toEqual([ '/package.json',
      '/src/app/app-routing.module.ts',
      '/src/app/app.component.spec.ts',
      '/src/app/app.component.ts',
      '/src/app/app.module.ts',
      '/src/app/auth/auth-callback/auth-callback.module.ts',
      '/src/app/auth/auth-callback/auth-callback.page.ts',
      '/src/app/auth/auth-guard.service.ts',
      '/src/app/auth/auth-http.service.ts',
      '/src/app/auth/auth.module.ts',
      '/src/app/auth/auth.service.ts',
      '/src/app/auth/end-session/end-session.module.ts',
      '/src/app/auth/end-session/end-session.page.ts',
      '/src/app/auth/factories/browser.factory.ts',
      '/src/app/auth/factories/http.factory.ts',
      '/src/app/auth/factories/index.ts',
      '/src/app/auth/factories/storage.factory.ts',
      '/src/app/auth/ng-http.service.ts',
      '/src/app/auth/user-info.model.ts',
      '/src/app/login/login.module.ts',
      '/src/app/login/login.page.html',
      '/src/app/login/login.page.scss',
      '/src/app/login/login.page.spec.ts',
      '/src/app/login/login.page.ts',
      '/src/app/tab1/tab1.page.html',
      '/src/app/tab1/tab1.page.spec.ts',
      '/src/app/tab1/tab1.page.ts' ]);

    const appModule = tree.readContent('/src/app/app.module.ts');

    expect(appModule).toMatch(/AuthModule/);
    expect(appModule).toMatch(/HttpClientModule/);

    const authService = tree.readContent('/src/app/auth/auth.service.ts');
    expect(authService).toContain(`clientId = '${defaultOptions.clientId}'`);
    expect(authService).toContain(`issuer = '${defaultOptions.issuer}'`);

    const pkgJson = tree.readContent('/package.json');
    expect(pkgJson).toContain('"cordova":');
    expect(pkgJson).toContain('"PHOTOLIBRARY_USAGE_DESCRIPTION"');
  });

  it('works with capacitor', async () => {
    const tree = new UnitTestTree(new HostTree);

    tree.create('/package.json', JSON.stringify(packageJson));
    tree.create('/src/app/app.module.ts', defaultAppModule);

    const capacitorOptions: any = {...defaultOptions};
    capacitorOptions.platform = 'capacitor';

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematicAsync('add-auth', capacitorOptions, tree).toPromise();

    expect(tree.files.length).toEqual(27);

    const appModule = tree.readContent('/src/app/app.module.ts');

    expect(appModule).toMatch(/AuthModule/);
    expect(appModule).toMatch(/HttpClientModule/);

    const authService = tree.readContent('/src/app/auth/auth.service.ts');
    expect(authService).toContain(`clientId = '${defaultOptions.clientId}'`);
    expect(authService).toContain(`issuer = '${defaultOptions.issuer}'`);

    const pkgJson = tree.readContent('/package.json');
    expect(pkgJson).not.toContain('"cordova":');
  });
});

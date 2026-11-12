import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

// tslint:disable:max-line-length
describe('OktaDev Schematics: Angular', () => {
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, './../collection.json'),
  );

  const defaultOptions: any = {
    issuer: 'https://dev-737523.okta.com/oauth2/default',
    clientId: '0oaifymbuodpH8nAi0h7'
  };

  let appTree: UnitTestTree | undefined;

  // tslint:disable-next-line:no-any
  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '3.0.0',
  };

  // tslint:disable-next-line:no-any
  const appOptions: any = {
    name: 'authtest',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
  };

  beforeEach(async () => {
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  });

  it('should create home component files', (done) => {
    const files = ['home.component.css', 'home.component.html', 'home.component.spec.ts', 'home.component.ts'];
    const homePath = '/projects/authtest/src/app/home/';
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      files.forEach(f => {
        const path = `${homePath}${f}`;
        expect(tree.exists(path)).toEqual(true);
      });
      done();
    }, done.fail);
  });

  it('should create an auth interceptor', (done) => {
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      expect(tree.exists('/projects/authtest/src/app/auth.interceptor.ts')).toEqual(true);
      done();
    }, done.fail);
  });

  it('should add routes for callback', (done) => {
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      const routingModule = tree.readContent('/projects/authtest/src/app/app.routes.ts');
      expect(routingModule).toContain(`path: 'home'`);
      expect(routingModule).toContain(`path: 'callback'`);
      done();
    }, done.fail);
  });

  it('should provide Okta auth in the app config file', (done) => {
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      const appModule = tree.readContent('/projects/authtest/src/app/app.config.ts');
      expect(appModule).toContain('provideOktaAuth(withOktaConfig({ oktaAuth }))');
      done();
    }, done.fail);
  });

  it('should set the issuer & clientId in the app config file', (done) => {
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      const appModule = tree.readContent('/projects/authtest/src/app/app.config.ts');
      expect(appModule).toContain(`issuer: '${defaultOptions.issuer}'`);
      expect(appModule).toContain(`clientId: '${defaultOptions.clientId}'`);
      done();
    }, done.fail);
  });

  it('should use Auth0 when --auth0 passed in', (done) => {
    const testOptions: any = {...defaultOptions};
    testOptions.auth0 = true;

    schematicRunner.runSchematic('add-auth', testOptions, appTree).then(tree => {
      const appModule = tree.readContent('/projects/authtest/src/app/app.config.ts');
      let domain: string = defaultOptions.issuer.substring(8);
      domain = domain.substring(0, domain.indexOf('/'));
      expect(appModule).toContain(`domain: '${domain}'`);
      expect(appModule).not.toContain(`domain: 'https://`);
      expect(appModule).toContain(`clientId: '${defaultOptions.clientId}'`);
      done();
    }, done.fail);
  });

  it('Auth0 should convert issuer to domain', (done) => {
    const testOptions: any = {...defaultOptions};
    testOptions.auth0 = true;

    schematicRunner.runSchematic('add-auth', testOptions, appTree).then(tree => {
      const appModule = tree.readContent('/projects/authtest/src/app/app.config.ts');
      let domain: string = defaultOptions.issuer.substring(8);
      domain = domain.substring(0, domain.indexOf('/'));
      expect(appModule).toContain(`domain: '${domain}'`);
      done();
    }, done.fail);
  });

  it('Auth0 issuer as domain still works', (done) => {
    const testOptions: any = {...defaultOptions};
    testOptions.issuer = 'jhipster.us.auth0.com';
    testOptions.auth0 = true;

    schematicRunner.runSchematic('add-auth', testOptions, appTree).then(tree => {
      const appModule = tree.readContent('/projects/authtest/src/app/app.config.ts');
      expect(appModule).toContain(`domain: 'jhipster.us.auth0.com'`);
      done();
    }, done.fail);
  });
  it('should not replace the app spec', (done) => {
    const appSpec = (tree0: UnitTestTree) => tree0.readContent('/projects/authtest/src/app/app.component.spec.ts');
    const before = appSpec(appTree!);
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      expect(appSpec(tree)).toEqual(before);
      done();
    }, done.fail);
  });

  describe('with Angular 20+ file names', () => {
    const appPath = '/projects/authtest/src/app';

    beforeEach(() => {
      // ng new 20+ generates app.ts, class App, and adds provideBrowserGlobalErrorListeners()
      appTree!.rename(`${appPath}/app.component.ts`, `${appPath}/app.ts`);
      appTree!.rename(`${appPath}/app.component.spec.ts`, `${appPath}/app.spec.ts`);
      appTree!.overwrite(`${appPath}/app.config.ts`, `import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
`);
    });

    for (const auth0 of [false, true]) {
      const provider = auth0 ? 'Auth0' : 'Okta';

      it(`should create home files without a suffix with ${provider}`, (done) => {
        schematicRunner.runSchematic('add-auth', {...defaultOptions, auth0}, appTree).then(tree => {
          ['home.css', 'home.html', 'home.spec.ts', 'home.ts'].forEach(f => expect(tree.exists(`${appPath}/home/${f}`)).toEqual(true));
          expect(tree.exists(`${appPath}/home/home.component.ts`)).toEqual(false);
          expect(tree.readContent(`${appPath}/home/home.ts`)).toContain('export class Home {');
          expect(tree.readContent(`${appPath}/home/home.ts`)).toContain(`templateUrl: './home.html'`);
          expect(tree.readContent(`${appPath}/app.routes.ts`)).toContain(`import { Home } from './home/home';`);
          expect(tree.exists(`${appPath}/app.component.spec.ts`)).toEqual(false);
          done();
        }, done.fail);
      });

      it(`should keep provideBrowserGlobalErrorListeners with ${provider}`, (done) => {
        schematicRunner.runSchematic('add-auth', {...defaultOptions, auth0}, appTree).then(tree => {
          expect(tree.readContent(`${appPath}/app.config.ts`)).toContain('provideBrowserGlobalErrorListeners(),');
          done();
        }, done.fail);
      });

      it(`should not use jasmine in the home spec with ${provider}`, (done) => {
        schematicRunner.runSchematic('add-auth', {...defaultOptions, auth0}, appTree).then(tree => {
          expect(tree.readContent(`${appPath}/home/home.spec.ts`)).not.toContain('jasmine');
          done();
        }, done.fail);
      });
    }
  });
});

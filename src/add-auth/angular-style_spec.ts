import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

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
    version: '0.5.0',
  };

  // tslint:disable-next-line:no-any
  const appOptions: any = {
    name: 'authtest',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'scss',
    skipTests: false,
  };

  beforeEach(async() => {
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  });

  it('should create home component files with scss', (done) => {
    const files = ['home.component.scss', 'home.component.html', 'home.component.spec.ts', 'home.component.ts'];
    const homePath = '/projects/authtest/src/app/home/';
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      files.forEach(f => {
        const path = `${homePath}${f}`;
        expect(tree.exists(path)).toEqual(true);
      });
      done();
    }, done.fail);
  });

  it('should use scss for style', (done) => {
    schematicRunner.runSchematic('add-auth', defaultOptions, appTree).then(tree => {
      const routingModule = tree.readContent('/projects/authtest/src/app/app.component.ts');
      expect(routingModule).toContain(`styleUrl: './app.component.scss'`);
      done();
    }, done.fail);
  });
});

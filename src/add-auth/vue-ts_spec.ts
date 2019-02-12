import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7',
  framework: 'vue-ts',
  skipPackageJson: true
};

describe('OktaDev Schematics: Vue + TypeScript', () => {
  it('requires required issuer option', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    expect(() => runner.runSchematic('add-auth', {}, Tree.empty())).toThrow();
  });

  it('works', () => {

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('add-auth', {...defaultOptions}, Tree.empty());

    expect(tree.files.length).toEqual(2);
    expect(tree.files.sort()).toEqual(['/src/App.vue', '/src/router.ts']);

    const componentContent = tree.readContent('/src/router.ts');

    expect(componentContent).toMatch(/OktaVuePlugin\.handleCallback\(\)/);
    expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(componentContent).toContain(`client_id: '${defaultOptions.clientId}'`);
  });

});

import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './vue-ts-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: Vue + TypeScript', () => {
  it('requires required issuer option', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const schematic = await runner.runSchematicAsync('add-auth', {}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });

  it('works', async () => {
    const tree = new UnitTestTree(new HostTree);

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematicAsync('add-auth', {...defaultOptions}, tree).toPromise();

    expect(tree.files.length).toEqual(3);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.vue', '/src/router/index.ts']);

    const routerContent = tree.readContent('/src/router/index.ts');

    expect(routerContent).toMatch(/Vue.use\(OktaVue, { oktaAuth }\)/);
    expect(routerContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(routerContent).toContain(`clientId: '${defaultOptions.clientId}'`);
  });
});

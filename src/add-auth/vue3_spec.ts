import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './vue3-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: Vue3',() => {
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

    expect(tree.files.length).toEqual(4);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.vue', '/src/main.js', '/src/router/index.js']);

    const routerContent = tree.readContent('/src/router/index.js');
    expect(routerContent).toMatch(/router.beforeEach\(navigationGuard\)/);

    const mainContent = tree.readContent('/src/main.js');
    expect(mainContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(mainContent).toContain(`clientId: '${defaultOptions.clientId}'`);
    expect(mainContent).toContain(`const oktaAuth = new OktaAuth(config)`);
    expect(mainContent).toContain(`.use(OktaVue, {oktaAuth})`);
  });
});

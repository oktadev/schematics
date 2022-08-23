import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './vue-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: Vue',() => {
  it('requires required issuer option', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const schematic = await runner.runSchematicAsync('add-auth', {}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });

  it('works with Okta', async () => {
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

  it('works with Auth0', async () => {
    const tree = new UnitTestTree(new HostTree);

    const auth0Options: any = {...defaultOptions};
    auth0Options.auth0 = true;
    auth0Options.issuer = 'https://dev-06bzs1cu.us.auth0.com/';

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematicAsync('add-auth', {...auth0Options}, tree).toPromise();

    expect(tree.files.length).toEqual(4);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.vue', '/src/main.js', '/src/router/index.js']);

    const routerContent = tree.readContent('/src/router/index.js');
    expect(routerContent).toMatch(/import { authGuard } from '@auth0\/auth0-vue'/);

    const mainContent = tree.readContent('/src/main.js');
    expect(mainContent).toContain(`import { createAuth0 } from '@auth0/auth0-vue'`);
    expect(mainContent).toContain(`domain: '${auth0Options.issuer.slice(8, -1)}'`);
    expect(mainContent).toContain(`client_id: '${auth0Options.clientId}'`);
    expect(mainContent).toContain(`.use(createAuth0(config))`);
  });
});

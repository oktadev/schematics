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

    const schematic = runner.runSchematic('add-auth', {}, Tree.empty());
    await expectAsync(schematic).toBeRejectedWithError(/required property 'issuer'/);
  });

  it('works with Okta', async () => {
    const tree = new UnitTestTree(new HostTree);

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematic('add-auth', {...defaultOptions}, tree);

    expect(tree.files.length).toEqual(4);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.vue', '/src/main.ts', '/src/router/index.ts']);

    const routerContent = tree.readContent('/src/router/index.ts');
    expect(routerContent).toMatch(/router.beforeEach\(navigationGuard\);/);

    const mainContent = tree.readContent('/src/main.ts');
    expect(mainContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(mainContent).toContain(`clientId: '${defaultOptions.clientId}'`);
    expect(mainContent).toContain(`const oktaAuth = new OktaAuth(config);`);
    expect(mainContent).toContain(`.use(OktaVue, {oktaAuth})`);
  });

  it('works with Auth0', async () => {
    const tree = new UnitTestTree(new HostTree);

    const testOptions: any = {...defaultOptions};
    testOptions.auth0 = true;
    testOptions.issuer = 'https://dev-06bzs1cu.us.auth0.com/';

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematic('add-auth', {...testOptions}, tree);

    expect(tree.files.length).toEqual(4);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.vue', '/src/main.ts', '/src/router/index.ts']);

    const routerContent = tree.readContent('/src/router/index.ts');
    expect(routerContent).toMatch(/import { authGuard } from '@auth0\/auth0-vue';/);

    const mainContent = tree.readContent('/src/main.ts');
    expect(mainContent).toContain(`import { createAuth0 } from '@auth0/auth0-vue';`);
    expect(mainContent).toContain(`domain: '${testOptions.issuer.slice(8, -1)}'`);
    expect(mainContent).toContain(`clientId: '${testOptions.clientId}'`);
    expect(mainContent).toContain(`.use(createAuth0(config))`);
  });
});

import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './react-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: React', () => {
  it('requires required issuer option', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const schematic = await runner.runSchematic('add-auth', {}, Tree.empty());
    await expectAsync(schematic).toBeRejectedWithError(/required property 'issuer'/);
  });

  it('works with Okta', async () => {
    const tree = new UnitTestTree(new HostTree);

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematic('add-auth', {...defaultOptions}, tree);

    expect(tree.files.length).toEqual(9);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.js', '/src/App.test.js',
      '/src/Home.js', '/src/Loading.js', '/src/Routes.js', '/src/SecureRoute.js', '/src/index.js',
      '/src/jest.setup.js']);

    const componentContent = tree.readContent('/src/App.js');

    expect(componentContent).toMatch(/const oktaAuth = new OktaAuth/);
    expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(componentContent).toContain(`clientId: '${defaultOptions.clientId}'`);
    expect(componentContent).toContain(`<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>`);
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

    expect(tree.files.length).toEqual(7);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.js', '/src/App.test.js',
      '/src/Home.js', '/src/Routes.js', '/src/index.js', '/src/jest.setup.js']);

    const componentContent = tree.readContent('/src/App.js');

    expect(componentContent).toMatch(/Auth0Provider domain/);
    expect(componentContent).toContain(`domain="${testOptions.issuer.slice(8, -1)}"`);
    expect(componentContent).toContain(`clientId="${testOptions.clientId}"`);
  });
});

import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './react-ts-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: React + TypeScript', () => {
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

    expect(tree.files.length).toEqual(9);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.test.tsx', '/src/App.tsx',
      '/src/Home.tsx', '/src/Loading.tsx', '/src/Routes.tsx', '/src/SecureRoute.tsx', '/src/index.tsx',
      '/src/jest.setup.js']);

    const componentContent = tree.readContent('/src/App.tsx');

    expect(componentContent).toMatch(/const oktaAuth = new OktaAuth/);
    expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(componentContent).toContain(`clientId: '${defaultOptions.clientId}'`);
  });

  it('fail with no package.json', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const schematic = await runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });

  it('fail when no frameworks', async () => {
    const pkgNoFrameworks = {...packageJson};
    // @ts-ignore
    delete pkgNoFrameworks.dependencies;
    const tree = new UnitTestTree(new HostTree);
    tree.create('/package.json', JSON.stringify(pkgNoFrameworks));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const schematic = await runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
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

    expect(tree.files.length).toEqual(6);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.test.tsx', '/src/App.tsx',
      '/src/Home.tsx', '/src/Routes.tsx', '/src/index.tsx']);

    const componentContent = tree.readContent('/src/App.tsx');

    expect(componentContent).toMatch(/Auth0Provider domain/);
    expect(componentContent).toContain(`domain="${auth0Options.issuer.slice(8, -1)}"`);
    expect(componentContent).toContain(`clientId="${auth0Options.clientId}"`);
  });
});

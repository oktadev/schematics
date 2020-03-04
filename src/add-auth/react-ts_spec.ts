import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
// const { spawnSync } = require('child_process');
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

  it('works', async() => {
    const tree = new UnitTestTree(new HostTree);

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    await runner.runSchematicAsync('add-auth', {...defaultOptions}, tree).toPromise();

    expect(tree.files.length).toEqual(5);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.test.tsx', '/src/App.tsx', '/src/Home.tsx',
      '/src/okta.d.ts']);

    const componentContent = tree.readContent('/src/App.tsx');

    expect(componentContent).toMatch(/class App extends Component/);
    expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(componentContent).toContain(`client_id: '${defaultOptions.clientId}'`);
  });

  it('fail with no package.json', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const schematic = await runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });

  it('fail when no frameworks', async () => {
    const pkgNoFrameworks = {...packageJson};
    delete pkgNoFrameworks.dependencies;
    const tree = new UnitTestTree(new HostTree);
    tree.create('/package.json', JSON.stringify(pkgNoFrameworks));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    const schematic = await runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });
});

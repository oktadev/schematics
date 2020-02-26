import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './react-native-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: React Native', () => {
  it('requires required issuer option', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const schematic = await runner.runSchematicAsync('add-auth', {}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });

  it('works', async () => {
    let tree = new UnitTestTree(new HostTree);

    // Add package.json
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    tree = await runner.runSchematicAsync('add-auth', {...defaultOptions}, tree).toPromise();

    expect(tree.files.length).toEqual(7);
    expect(tree.files.sort()).toEqual(['/App.js', '/Auth.js', '/auth.config.js', '/package.json',
      '/setupJest.js', '/tests/App-test.js', '/tests/Auth-test.js']);

    const authComponent = tree.readContent('/Auth.js');
    expect(authComponent).toMatch(/class Auth extends Component/);

    const config = tree.readContent('/auth.config.js');
    expect(config).toContain(`discoveryUri: '${defaultOptions.issuer}'`);
    expect(config).toContain(`clientId: '${defaultOptions.clientId}'`);
  });

  it('fail with no package.json', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const schematic = await runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty());
    await expectAsync(schematic.toPromise()).toBeRejected();
  });
});

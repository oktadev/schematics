import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './express-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7',
  clientSecret: 'take me home, country roads'
};

describe('OktaDev Schematics: Express', () => {
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

    expect(tree.files.length).toEqual(6);
    expect(tree.files.sort()).toEqual(['/.env','/app.js', '/package.json',
      '/routes/index.js', '/views/index.pug', '/views/login.pug']);

    const componentContent = tree.readContent('/app.js');

    expect(componentContent).toMatch(/const oidc = new ExpressOIDC/);

    const dotenv = tree.readContent('/.env');

    expect(dotenv).toContain(`OIDC_ISSUER=${defaultOptions.issuer}`);
    expect(dotenv).toContain(`OIDC_CLIENT_ID=${defaultOptions.clientId}`);
    expect(dotenv).toContain(`OIDC_CLIENT_SECRET=${defaultOptions.clientSecret}`);

  });
});

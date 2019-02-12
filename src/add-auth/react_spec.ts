import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7',
  framework: 'react',
  skipPackageJson: true
};

describe('OktaDev Schematics: React', () => {
  it('requires required issuer option', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    expect(() => runner.runSchematic('add-auth', {}, Tree.empty())).toThrow();
  });

  it('works', (done) => {
    const files = ['/src/App.js', '/src/Home.js'];
    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty()).toPromise().then(tree => {
      files.forEach(file => {
        expect(tree.exists(file)).toEqual(true);
      });
      const componentContent = tree.readContent('/src/App.js');

      expect(componentContent).toMatch(/class App extends Component/);
      expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
      expect(componentContent).toContain(`client_id: '${defaultOptions.clientId}'`);

      done();
    }, done.fail);
  });
});

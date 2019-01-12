import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ComponentOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: ComponentOptions = {
  issuer: 'https://dev-737523.oktapreview.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7'
};

describe('OktaDev Schematics: React', () => {
  it('requires required issuer option', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    expect(() => runner.runSchematic('add-auth', {}, Tree.empty())).toThrow();
  });

  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('add-auth', {...defaultOptions}, Tree.empty());

    expect(tree.files.length).toEqual(3);
    expect(tree.files.sort()).toEqual(['/src/App.tsx', '/src/Home.tsx', '/src/okta.d.ts']);

    const componentContent = tree.readContent('/src/App.tsx');

    expect(componentContent).toMatch(/class App extends React\.Component/);
    expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(componentContent).toContain(`client_id: '${defaultOptions.clientId}'`);
  });

});

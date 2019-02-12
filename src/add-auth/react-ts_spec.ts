import { HostTree, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
// const { spawnSync } = require('child_process');
// import { Schema as ComponentOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7',
  framework: 'react-ts',
  skipPackageJson: true
};

describe('OktaDev Schematics: React + TypeScript', () => {
  it('requires required issuer option', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    expect(() => runner.runSchematic('add-auth', {}, Tree.empty())).toThrow();
  });

  it('works', () => {
    const tree = new UnitTestTree(new HostTree);
    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematic('add-auth', {...defaultOptions}, tree);

    console.log('tree', tree.files);
    expect(tree.files.length).toEqual(3);
    expect(tree.files.sort()).toEqual(['/src/App.tsx', '/src/Home.tsx', '/src/okta.d.ts']);

    const componentContent = tree.readContent('/src/App.tsx');

    expect(componentContent).toMatch(/class App extends React\.Component/);
    expect(componentContent).toContain(`issuer: '${defaultOptions.issuer}'`);
    expect(componentContent).toContain(`client_id: '${defaultOptions.clientId}'`);
  });

});

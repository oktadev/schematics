"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
// tslint:disable:max-line-length
describe('Okta Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@okta/auth', path.join(__dirname, './collection.json'));
    const defaultOptions = {
        issuer: 'https://dev-737523.oktapreview.com/oauth2/default',
        clientId: '0oaifymbuodpH8nAi0h7'
    };
    let appTree;
    // tslint:disable-next-line:no-any
    const workspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '0.5.0',
    };
    // tslint:disable-next-line:no-any
    const appOptions = {
        name: 'authtest',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
    };
    beforeEach(() => {
        appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
        appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    });
    it('should create home component files', (done) => {
        const files = ['home.component.css', 'home.component.html', 'home.component.spec.ts', 'home.component.ts'];
        const homePath = '/projects/authtest/src/app/home';
        schematicRunner.runSchematicAsync('ng-add', defaultOptions, appTree).toPromise().then(tree => {
            files.forEach(f => {
                const path = `${homePath}${f}`;
                expect(tree.exists(path)).toEqual(true);
            });
            done();
        }, done.fail);
    });
    it('should create an auth interceptor', (done) => {
        schematicRunner.runSchematicAsync('ng-add', defaultOptions, appTree).toPromise().then(tree => {
            expect(tree.exists('/projects/authtest/src/shared/okta/auth.interceptor.ts')).toEqual(true);
            done();
        }, done.fail);
    });
    it('should add routes for callback', (done) => {
        schematicRunner.runSchematicAsync('ng-add', defaultOptions, appTree).toPromise().then(tree => {
            const routingModule = tree.readContent('/projects/authtest/src/app/app-routing.module.ts');
            expect(routingModule).toContain(`path: 'home'`);
            expect(routingModule).toContain(`path: 'implicit/callback'`);
            done();
            done();
        }, done.fail);
    });
    it('should set the issuer & clientId in the app module file', (done) => {
        schematicRunner.runSchematicAsync('ng-add', defaultOptions, appTree).toPromise().then(tree => {
            const appModule = tree.readContent('/projects/authtest/src/app/app.module.ts');
            expect(appModule).toContain(`issuer: '${defaultOptions.issuer}'`);
            expect(appModule).toContain(`clientId: '${defaultOptions.clientId}'`);
            done();
        }, done.fail);
    });
});
//# sourceMappingURL=index_spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
// From https://developer.okta.com/blog/2018/08/22/basic-crud-angular-7-and-spring-boot-2#oktas-angular-support
// 0. npm install @okta/okta-angular@1.0.7
// 1. Update app.module.ts to add config and initialize
// 2. Add callback to app-routing.module.ts
// 3. Add and configure HttpInterceptor
// 4. Add login and logout buttons
// 5. Add logic to app.component.ts
// 6. Generate HomeComponent and configure with auth
function getWorkspace(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();
    return {
        path,
        workspace: core_1.parseJson(content, core_1.JsonParseMode.Loose),
    };
}
function default_1(options) {
    return (host, context) => {
        const { workspace } = getWorkspace(host);
        if (!options.issuer) {
            throw new schematics_1.SchematicsException('You must specify an "issuer".');
        }
        // todo: allow project to be selected
        const project = workspace.projects[0];
        if (!project) {
            throw new schematics_1.SchematicsException(`Project is not defined in this workspace.`);
        }
        if (project.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Okta requires a project type of "application".`);
        }
        // Setup sources to add to the project
        const sourcePath = core_1.join(core_1.normalize(project.root), 'src');
        const templatesPath = core_1.join(sourcePath, 'src');
        const templateSource = schematics_1.apply(schematics_1.url('./files/src'), [
            schematics_1.template(Object.assign({}, options)),
            schematics_1.move(core_1.getSystemPath(templatesPath)),
        ]);
        // Chain the rules and return
        return schematics_1.chain([
            schematics_1.mergeWith(templateSource),
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map
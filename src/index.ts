/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
import {
  JsonParseMode,
  experimental,
  getSystemPath,
  join,
  normalize,
  parseJson,
} from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  template,
  url,
} from '@angular-devkit/schematics';

export interface OktaOptions {
  clientId: string;
  issuer: string;
}

// From https://developer.okta.com/blog/2018/08/22/basic-crud-angular-7-and-spring-boot-2#oktas-angular-support
// 0. npm install @okta/okta-angular@1.0.7
// 1. Update app.module.ts to add config and initialize
// 2. Add callback to app-routing.module.ts
// 3. Add and configure HttpInterceptor
// 4. Add login and logout buttons
// 5. Add logic to app.component.ts
// 6. Generate HomeComponent and configure with auth

function getWorkspace(
  host: Tree,
): { path: string, workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = [ '/angular.json', '/.angular.json' ];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return {
    path,
    workspace: parseJson(
      content,
      JsonParseMode.Loose,
    ) as {} as experimental.workspace.WorkspaceSchema,
  };
}

export default function (options: OktaOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const { workspace } = getWorkspace(host);

    if (!options.issuer) {
      throw new SchematicsException('You must specify an "issuer".');
    }

    // todo: allow project to be selected
    const project = workspace.projects[0];

    // Setup sources to add to the project
    const sourcePath = join(normalize(project.root), 'src');
    const templatesPath = join(sourcePath, 'src');
    const templateSource = apply(url('./files/src'), [
      template({ ...options }),
      move(getSystemPath(templatesPath)),
    ]);

    // Chain the rules and return
    return chain([
      mergeWith(templateSource),
    ])(host, context);
  };
}

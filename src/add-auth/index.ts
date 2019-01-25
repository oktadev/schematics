import { experimental, getSystemPath, join, JsonParseMode, normalize, parseJson } from '@angular-devkit/core';
import {
  apply,
  chain,
  FileEntry,
  forEach,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from 'schematics-utilities';

// From https://developer.okta.com/blog/2018/08/22/basic-crud-angular-7-and-spring-boot-2#oktas-angular-support
// 0. npm install @okta/okta-angular@1.0.7
// 1. Update app.module.ts to add config and initialize
// 2. Add callback to app-routing.module.ts
// 3. Add and configure HttpInterceptor
// 4. Add login and logout buttons
// 5. Add logic to app.component.ts
// 6. Generate HomeComponent and configure with auth

function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {type: NodeDependencyType.Default, version: '~1.0.7', name: '@okta/okta-angular'}
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function getWorkspace(
  host: Tree,
): { path: string, workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = ['/angular.json', '/.angular.json'];
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

export function addAuth(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const {workspace} = getWorkspace(host);

    if (!options.issuer) {
      throw new SchematicsException('You must specify an "issuer".');
    }

    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    // Setup sources to add to the project
    const sourcePath = join(normalize(project.root), 'src');
    const templatesPath = join(sourcePath, '');
    const templateSource = apply(url('./files/src'), [
      template({...options}),
      move(getSystemPath(templatesPath)),
      // fix for https://github.com/angular/angular-cli/issues/11337
      forEach((fileEntry: FileEntry) => {
        if (host.exists(fileEntry.path)) {
          host.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      }),
    ]);

    // Chain the rules and return
    return chain([
      options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
      options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ])(host, context);
  };
}

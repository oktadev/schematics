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

function addPackageJsonDependencies(framework: string): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [];

    if (framework === ANGULAR) {
      dependencies.push({ type: NodeDependencyType.Default, version: '~1.0.7', name: '@okta/okta-angular' })
    } else if (framework === REACT || framework === REACT_TS) {
      dependencies.push({ type: NodeDependencyType.Default, version: '~1.1.4', name: '@okta/okta-react' });
      dependencies.push({ type: NodeDependencyType.Default, version: '~4.3.1', name: 'react-router-dom' });
      if (framework === REACT_TS) {
        dependencies.push({ type: NodeDependencyType.Default, version: '~4.2.7', name: '@types/react-router-dom' });
      }
    } else if (framework === VUE || framework == VUE_TS) {
      dependencies.push({ type: NodeDependencyType.Default, version: '~1.0.7', name: '@okta/okta-vue' });
      if (framework === VUE_TS) {
        dependencies.push({ type: NodeDependencyType.Dev, version: '~1.0.1', name: '@types/okta__okta-vue' });
      }
    }

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added '${dependency.name}' into ${dependency.type}`);
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

export const ANGULAR = 'angular';
export const REACT = 'react';
export const REACT_TS = 'react-ts';
export const VUE = 'vue';
export const VUE_TS = 'vue-ts';

function getFramework(host: Tree): string {
  let possibleFiles = [ '/package.json' ];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  } else {
    const content = JSON.parse(configBuffer.toString());
    if (content.dependencies['@angular/core']) {
      return ANGULAR;
    } else if (content.dependencies['react']) {
      if (content.dependencies['typescript']) {
        return REACT_TS
      }
      return REACT;
    } else if (content.dependencies['vue']) {
      if (content.devDependencies['typescript']) {
        return VUE_TS
      }
      return VUE;
    } else {
      throw new SchematicsException('No JS frameworks found in your package.json!');
    }
  }
}

export function addAuth(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    // allow passing the framework in (for testing)
    let framework = options.framework;

    // if no framework defined, try to detect it
    if (!framework) {
      framework = getFramework(host);
    }

    let projectPath = './';

    if (framework === ANGULAR) {
      const { workspace } = getWorkspace(host);

      if (!options.issuer) {
        throw new SchematicsException('You must specify an "issuer".');
      }

      const project = workspace.projects[Object.keys(workspace.projects)[0]];
      projectPath = project.root;
    }

    // Setup sources to add to the project
    const sourcePath = join(normalize(projectPath), 'src');
    const templatesPath = join(sourcePath, '');
    const templateSource = apply(url('./' + framework + '/src'), [
      template({ ...options }),
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
      options && options.skipPackageJson ? noop() : addPackageJsonDependencies(framework),
      options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ])(host, context);
  };
}

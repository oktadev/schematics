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
import {
  addModuleImportToModule,
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType
} from 'schematics-utilities';

function addPackageJsonDependencies(framework: string, options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [];

    if (framework === ANGULAR) {
      dependencies.push({type: NodeDependencyType.Default, version: '2.0.0', name: '@okta/okta-angular'})
    } else if (framework === REACT || framework === REACT_TS) {
      dependencies.push({type: NodeDependencyType.Default, version: '3.0.1', name: '@okta/okta-react'});
      dependencies.push({type: NodeDependencyType.Default, version: '5.2.0', name: 'react-router-dom'});
      if (framework === REACT_TS) {
        dependencies.push({type: NodeDependencyType.Default, version: '5.1.5', name: '@types/react-router-dom'});
      }
    } else if (framework === REACT_NATIVE) {
      dependencies.push({type: NodeDependencyType.Default, version: '1.4.0', name: '@okta/okta-react-native'});
      dependencies.push({type: NodeDependencyType.Dev, version: '3.11.0', name: 'enzyme'});
      dependencies.push({type: NodeDependencyType.Dev, version: '1.15.2', name: 'enzyme-adapter-react-16'});
      dependencies.push({type: NodeDependencyType.Dev, version: '0.9.1', name: 'enzyme-async-helpers'});
      dependencies.push({type: NodeDependencyType.Dev, version: '16.13.1', name: 'react-dom'});
    } else if (framework === VUE || framework == VUE_TS) {
      dependencies.push({type: NodeDependencyType.Default, version: '2.0.0', name: '@okta/okta-vue'});
      if (framework === VUE_TS) {
        dependencies.push({type: NodeDependencyType.Dev, version: '1.2.0', name: '@types/okta__okta-vue'});
      }
    } else if (framework === IONIC_ANGULAR) {
      dependencies.push({type: NodeDependencyType.Default, version: '0.5.1', name: 'ionic-appauth'});
      dependencies.push({type: NodeDependencyType.Default, version: '5.23.0', name: '@ionic-native/secure-storage'});
      if (options.platform === 'capacitor') {
        dependencies.push({type: NodeDependencyType.Default, version: '5.0.1', name: 'cordova-plugin-secure-storage-echo'});
        dependencies.push({type: NodeDependencyType.Default, version: '2.4.1', name: 'cordova-plugin-advanced-http'});
        dependencies.push({type: NodeDependencyType.Default, version: '1.6.0', name: 'cordova-plugin-safariviewcontroller'});
        dependencies.push({type: NodeDependencyType.Default, version: '5.26.0', name: '@ionic-native/http'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: '2.2.0', name: '@ionic/storage'});
      }
    } else if (framework === EXPRESS) {
      dependencies.push({type: NodeDependencyType.Default, version: '1.17.1', name: 'express-session'});
      dependencies.push({type: NodeDependencyType.Default, version: '4.0.1', name: '@okta/oidc-middleware'});
      dependencies.push({type: NodeDependencyType.Default, version: '8.2.0', name: 'dotenv'});
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
export const REACT_NATIVE = 'react-native';
export const VUE = 'vue';
export const VUE_TS = 'vue-ts';
export const IONIC_ANGULAR = 'ionic/angular';
export const EXPRESS = 'express';

function getFramework(host: Tree): string {
  let possibleFiles = ['/package.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  } else {
    const content = JSON.parse(configBuffer.toString());
    if (content.dependencies['@angular/core'] && !content.dependencies['@ionic/angular']) {
      return ANGULAR;
    } else if (content.dependencies['react']) {
      if (content.dependencies['react-native']) {
        return REACT_NATIVE;
      }
      if (content.dependencies['typescript']) {
        return REACT_TS
      }
      return REACT;
    } else if (content.dependencies['vue']) {
      if (content.devDependencies['typescript']) {
        return VUE_TS
      }
      return VUE;
    } else if (content.dependencies['@ionic/angular']) {
      return IONIC_ANGULAR;
    } else if (content.dependencies['express']) {
      return EXPRESS;
    } else {
      throw new SchematicsException('No supported frameworks found in your package.json!');
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
      const {workspace} = getWorkspace(host);

      if (!options.issuer) {
        throw new SchematicsException('You must specify an "issuer".');
      }

      const project = workspace.projects[Object.keys(workspace.projects)[0]];
      projectPath = project.root;

      if (!options.project) {
        options.project = Object.keys(workspace.projects)[0];
      }

      let style = project.architect?.build.options.styles[0];
      if (style) {
        options.style = style.substring(style.lastIndexOf('.') + 1, style.length);
      } else {
        options.style = 'css';
      }

      // add imports to app.module.ts
      addModuleImportToModule(host, projectPath + '/src/app/app.module.ts',
        'AuthRoutingModule', './auth-routing.module');
    }

    if (framework == IONIC_ANGULAR) {
      // add a package name from the issuer
      const parts = options.issuer.split('.');
      if (options.issuer.indexOf('.') === -1) {
        // hard-code a package name for localhost
        options.packageName = 'dev.localhost.ionic';
      } else {
        options.packageName =
          parts[2].substring(0, parts[2].indexOf('/')) + '.'
          + parts[1] + '.'
          + parts[0].substring(parts[0].lastIndexOf('/') + 1);
      }

      // add cordova to package.json
      if (options.platform === 'cordova') {
        const content: Buffer | null = host.read('./package.json');
        if (content) {
          const pkgJson: any = JSON.parse(content.toString());
          // save any pre-existing plugins
          if (pkgJson.cordova && pkgJson.cordova.plugins) {
            const existingPlugins = pkgJson.cordova.plugins;
            pkgJson.cordova.plugins = {...cordovaNode(options.packageName).plugins, ...existingPlugins};
            pkgJson.cordova.platforms = cordovaNode(options.packageName).platforms;
          } else {
            pkgJson.cordova = cordovaNode(options.packageName);
          }
          host.overwrite('./package.json', JSON.stringify(pkgJson));
        }
        addModuleImportToModule(host, 'src/app/app.module.ts',
          'IonicStorageModule.forRoot()', '@ionic/storage');
      }

      // add imports to app.module.ts
      addModuleImportToModule(host, 'src/app/app.module.ts',
        'HttpClientModule', '@angular/common/http');
      addModuleImportToModule(host, 'src/app/app.module.ts',
        'AuthModule', './auth/auth.module');
    }

    if (framework === REACT_NATIVE) {
      // add a package name from the issuer
      const parts = options.issuer.split('.');
      options.packageName = parts[2].substring(0, parts[2].indexOf('/')) + '.'
        + parts[1] + '.' + parts[0].substring(parts[0].lastIndexOf('/') + 1);
      const content: Buffer | null = host.read('./package.json');
      if (content) {
        const pkgJson: any = JSON.parse(content.toString());
        // add jest config for tests
        pkgJson.jest = {
          "preset": "react-native",
          "automock": false,
          "transformIgnorePatterns": [
            "node_modules/(?!@okta|react-native)"
          ],
          "testMatch": ["**/tests/*.js?(x)", "**/?(*.)(spec|test).js?(x)"],
          "setupFiles": [
            "./setupJest.js"
          ]
          // The reason tests are in `tests` instead of `__tests__` is because
          // schematics uses double underscore as a substitution indicator in filenames.
          // If you try to put tests in __tests__, you'll get an error:
          // Error: Option "tests" is not defined.
        };
        host.overwrite('./package.json', JSON.stringify(pkgJson));

        // Upgrade iOS to v11
        const podfile: Buffer | null = host.read('./ios/Podfile');
        if (podfile) {
          const ios11 = podfile.toString('utf-8').replace("platform :ios, '9.0'","platform :ios, '11.0'");
          host.overwrite('ios/Podfile', ios11);
        }

        // Configure Gradle for Android
        const androidBuild: Buffer | null = host.read('./android/build.gradle');
        if (androidBuild) {
          const minSDK = androidBuild.toString('utf-8').replace('minSdkVersion = 16', 'minSdkVersion = 19');
          const maven = minSDK.toString()
            .replace("maven { url 'https://www.jitpack.io' }", "maven { url 'https://www.jitpack.io' }\n" +
            "        maven { url 'https://dl.bintray.com/okta/com.okta.android' }");
          host.overwrite('android/build.gradle', maven);
        }

        // Configure Gradle for App
        const appBuild: Buffer | null = host.read('./android/app/build.gradle');
        if (appBuild) {
          const redirectScheme = appBuild.toString('utf-8')
            .replace('versionName "1.0"', 'versionName "1.0"\n        manifestPlaceholders = [ appAuthRedirectScheme: "' + options.packageName + '" ]');
          host.overwrite('android/app/build.gradle', redirectScheme);
        }
      }
    }

    // Setup templates to add to the project
    const sourceDir = (framework !== REACT_NATIVE && framework !== EXPRESS) ? 'src' : '';
    const sourcePath = join(normalize(projectPath), sourceDir);
    const templatesPath = join(sourcePath, '');
    const templateSource = apply(url(`./${framework}/${sourceDir}`), [
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
      options && options.skipPackageJson ? noop() : addPackageJsonDependencies(framework, options),
      options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ])(host, context);
  };
}

export function cordovaNode(packageName: string) {
  return {
    'plugins': {
      'cordova-plugin-advanced-http': {},
      'cordova-plugin-safariviewcontroller': {},
      'cordova-plugin-inappbrowser': {},
      'cordova-plugin-secure-storage-echo': {},
      'cordova-plugin-customurlscheme': {
        'URL_SCHEME': packageName
      },
      'cordova-plugin-whitelist': {},
      'cordova-plugin-statusbar': {},
      'cordova-plugin-device': {},
      'cordova-plugin-splashscreen': {},
      'cordova-plugin-ionic-webview': {
        'ANDROID_SUPPORT_ANNOTATIONS_VERSION': '27.+'
      },
      'cordova-plugin-ionic-keyboard': {}
    },
    'platforms': [
      'android',
      'ios'
    ]
  }
}

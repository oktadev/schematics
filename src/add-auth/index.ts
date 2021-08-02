import { getSystemPath, join, normalize } from '@angular-devkit/core';
import {
  apply,
  chain,
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
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { targetBuildNotFoundError } from '@schematics/angular/utility/project-targets';
import { BrowserBuilderOptions } from '@schematics/angular/utility/workspace-models';
import { dependencies as sdkVersions } from '../sdk-versions.json';
import semverSatisfies from 'semver/functions/satisfies';
import semverCoerce from 'semver/functions/coerce';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { addModuleImportToModule, parseSourceFile } from '@angular/cdk/schematics';
import { addProviderToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

const OKTA_AUTH_JS_VERSION = sdkVersions['@okta/okta-auth-js'];
const OKTA_ANGULAR_VERSION = sdkVersions['@okta/okta-angular'];
const OKTA_REACT_VERSION = sdkVersions['@okta/okta-react'];
const REACT_ROUTER_DOM_VERSION = sdkVersions['react-router-dom'];
const REACT_ROUTER_DOM_TYPES_VERSION = sdkVersions['@types/react-router-dom'];
const OKTA_REACT_NATIVE_VERSION = sdkVersions['@okta/okta-react-native'];
const EVENTS_VERSION = sdkVersions['events'];
const ENZYME_VERSION = sdkVersions['enzyme'];
const ENZYME_ADAPTER_VERSION = sdkVersions['enzyme-adapter-react-16'];
const ENZYME_ASYNC_VERSION = sdkVersions['enzyme-async-helpers'];
const REACT_DOM_VERSION = sdkVersions['react-dom'];
const OKTA_VUE2_VERSION = sdkVersions['@okta/okta-vue2'];
const OKTA_VUE3_VERSION = sdkVersions['@okta/okta-vue'];
const IONIC_APPAUTH_VERSION = sdkVersions['ionic-appauth'];
const IONIC_SECURE_STORAGE_VERSION = sdkVersions['@ionic-native/secure-storage'];
const IONIC_CORDOVA_SECURE_STORAGE_VERSION = sdkVersions['cordova-plugin-secure-storage-echo'];
const IONIC_CORDOVA_ADVANCED_HTTP_VERSION = sdkVersions['cordova-plugin-advanced-http'];
const IONIC_CORDOVA_FILE_VERSION = sdkVersions['cordova-plugin-file'];
const IONIC_NATIVE_HTTP_VERSION = sdkVersions['@ionic-native/http'];
const IONIC_CORDOVA_SAFARIVIEWCONTROLLER_VERSION = sdkVersions['cordova-plugin-safariviewcontroller'];
const IONIC_STORAGE_VERSION = sdkVersions['@ionic/storage'];
const IONIC_STORAGE_ANGULAR_VERSION = sdkVersions['@ionic/storage-angular'];
const IONIC_SPLASH_SCREEN_VERSION = sdkVersions['@ionic-native/splash-screen'];
const IONIC_STATUS_BAR_VERSION = sdkVersions['@ionic-native/status-bar'];
const EXPRESS_SESSION_VERSION = sdkVersions['express-session'];
const OKTA_OIDC_MIDDLEWARE_VERSION = sdkVersions['@okta/oidc-middleware'];
const DOTENV_VERSION = sdkVersions['dotenv'];

function addPackageJsonDependencies(framework: string, options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [];

    if (framework === ANGULAR) {
      dependencies.push({type: NodeDependencyType.Default, version: OKTA_ANGULAR_VERSION, name: '@okta/okta-angular'})
    } else if (framework === REACT || framework === REACT_TS) {
      dependencies.push({type: NodeDependencyType.Default, version: OKTA_REACT_VERSION, name: '@okta/okta-react'});
      dependencies.push({type: NodeDependencyType.Default, version: OKTA_AUTH_JS_VERSION, name: '@okta/okta-auth-js'});
      dependencies.push({type: NodeDependencyType.Default, version: REACT_ROUTER_DOM_VERSION, name: 'react-router-dom'});
      if (framework === REACT_TS) {
        dependencies.push({type: NodeDependencyType.Default, version: REACT_ROUTER_DOM_TYPES_VERSION, name: '@types/react-router-dom'});
      }
    } else if (framework === REACT_NATIVE) {
      dependencies.push({type: NodeDependencyType.Default, version: OKTA_REACT_NATIVE_VERSION, name: '@okta/okta-react-native'});
      dependencies.push({type: NodeDependencyType.Default, version: EVENTS_VERSION, name: 'events'});
      dependencies.push({type: NodeDependencyType.Dev, version: ENZYME_VERSION, name: 'enzyme'});
      dependencies.push({type: NodeDependencyType.Dev, version: ENZYME_ADAPTER_VERSION, name: 'enzyme-adapter-react-16'});
      dependencies.push({type: NodeDependencyType.Dev, version: ENZYME_ASYNC_VERSION, name: 'enzyme-async-helpers'});
      dependencies.push({type: NodeDependencyType.Dev, version: REACT_DOM_VERSION, name: 'react-dom'});
    } else if (framework === VUE || framework === VUE_TS || framework === VUE3 || framework === VUE3_TS) {
      const oktaVueVersion = (framework === VUE || framework === VUE_TS) ? OKTA_VUE2_VERSION : OKTA_VUE3_VERSION;
      dependencies.push({type: NodeDependencyType.Default, version: oktaVueVersion, name: '@okta/okta-vue'});
      dependencies.push({type: NodeDependencyType.Default, version: OKTA_AUTH_JS_VERSION, name: '@okta/okta-auth-js'});
    } else if (framework === IONIC_ANGULAR) {
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_APPAUTH_VERSION, name: 'ionic-appauth'});
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_SECURE_STORAGE_VERSION, name: '@ionic-native/secure-storage'});
      if (options.platform === 'capacitor') {
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_CORDOVA_SECURE_STORAGE_VERSION, name: 'cordova-plugin-secure-storage-echo'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_CORDOVA_ADVANCED_HTTP_VERSION, name: 'cordova-plugin-advanced-http'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_CORDOVA_FILE_VERSION, name: 'cordova-plugin-file'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_CORDOVA_SAFARIVIEWCONTROLLER_VERSION, name: 'cordova-plugin-safariviewcontroller'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_NATIVE_HTTP_VERSION, name: '@ionic-native/http'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_STORAGE_VERSION, name: '@ionic/storage'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_STORAGE_ANGULAR_VERSION, name: '@ionic/storage-angular'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_SPLASH_SCREEN_VERSION, name: '@ionic-native/splash-screen'});
        dependencies.push({type: NodeDependencyType.Default, version: IONIC_STATUS_BAR_VERSION, name: '@ionic-native/status-bar'});
      }
    } else if (framework === EXPRESS) {
      dependencies.push({type: NodeDependencyType.Default, version: EXPRESS_SESSION_VERSION, name: 'express-session'});
      dependencies.push({type: NodeDependencyType.Default, version: OKTA_OIDC_MIDDLEWARE_VERSION, name: '@okta/oidc-middleware'});
      dependencies.push({type: NodeDependencyType.Default, version: DOTENV_VERSION, name: 'dotenv'});
    }

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      // @ts-ignore
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

export const ANGULAR = 'angular';
export const REACT = 'react';
export const REACT_TS = 'react-ts';
export const REACT_NATIVE = 'react-native';
export const VUE = 'vue';
export const VUE_TS = 'vue-ts';
export const VUE3 = 'vue3';
export const VUE3_TS = 'vue3-ts';
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
      const vueVersion = content.dependencies['vue'];
      const currentVersion = semverCoerce(vueVersion)?.version;
      const vue3 = (currentVersion) ? semverSatisfies(currentVersion, '>=3.0.0') : false;
      if (vue3) {
        return (content.devDependencies['@vue/cli-plugin-typescript']) ? VUE3_TS : VUE3;
      } else {
        return (content.devDependencies['typescript']) ? VUE_TS : VUE;
      }
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
  return async (host: Tree) => {
    // allow passing the framework in (for testing)
    let framework = options.framework;

    // if no framework defined, try to detect it
    if (!framework) {
      framework = getFramework(host);
    }

    let projectPath = './';

    if (framework === ANGULAR) {
      const workspace = await getWorkspace(host);

      if (!options.issuer) {
        throw new SchematicsException('You must specify an "issuer".');
      }

      if (!options.project) {
        options.project = workspace.projects.keys().next().value;
      }

      const project = workspace.projects.get(options.project);
      if (!project) {
        throw new SchematicsException(`Invalid project name: ${options.project}`);
      }
      projectPath = project.root;

      const buildTarget = project.targets?.get('build');
      if (!buildTarget) {
        throw targetBuildNotFoundError();
      }
      const buildOptions = (buildTarget.options || {}) as unknown as BrowserBuilderOptions;
      if (buildOptions.styles) {
        let style = buildOptions.styles[0] as string;
        if (style) {
          options.style = style.substring(style.lastIndexOf('.') + 1, style.length);
        } else {
          options.style = 'css';
        }
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

      // create AuthConfigService for JHipster
      if (options.configUri) {
        host.create('src/app/auth/auth-config.service.ts', ionicRemoteConfig(options.configUri));
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
          'IonicStorageModule.forRoot()', '@ionic/storage-angular');

        // add SplashScreen and StatusBar providers for Cordova
        const moduleSource = parseSourceFile(host, 'src/app/app.module.ts');
        const splashScreenChanges = addProviderToModule(moduleSource,'src/app/app.module.ts',
            'SplashScreen', '@ionic-native/splash-screen/ngx');
        const statusBarChanges = addProviderToModule(moduleSource, 'src/app/app.module.ts',
            'StatusBar', '@ionic-native/status-bar/ngx');

        const updater = host.beginUpdate('./src/app/app.module.ts');
        for (const change of splashScreenChanges) {
          if (change instanceof InsertChange) {
            updater.insertRight(change.pos, change.toAdd);
          }
        }
        for (const change of statusBarChanges) {
          if (change instanceof InsertChange) {
            updater.insertRight(change.pos, change.toAdd);
          }
        }
        host.commitUpdate(updater)
      }

      // add imports to app.module.ts
      addModuleImportToModule(host, 'src/app/app.module.ts',
        'HttpClientModule', '@angular/common/http');
      addModuleImportToModule(host, 'src/app/app.module.ts',
        'AuthModule', './auth/auth.module');

      // Add new modules to tsconfig.app.json
      const tsConfig: Buffer | null = host.read('./tsconfig.app.json');
      if (tsConfig) {
        let config: string = tsConfig.toString();
        config = config.replace('"src/polyfills.ts"', `"src/polyfills.ts",
    "src/app/auth/auth-callback/auth-callback.module.ts",
    "src/app/auth/end-session/end-session.module.ts",
    "src/app/login/login.module.ts",
    "src/app/tabs/tabs.module.ts"`);
        host.overwrite('./tsconfig.app.json', config);
      }
    }

    if (framework === REACT || framework === REACT_TS) {
      const jestConfig = {
        'moduleNameMapper': {
          '^@okta/okta-auth-js$': '<rootDir>/node_modules/@okta/okta-auth-js/dist/okta-auth-js.umd.js'
        }
      }
      const content: Buffer | null = host.read('./package.json');
      if (content) {
        const pkgJson: any = JSON.parse(content.toString());
        pkgJson.jest = jestConfig;
        host.overwrite('./package.json', JSON.stringify(pkgJson));
      }
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
          'preset': 'react-native',
          'automock': false,
          'testEnvironment': 'jsdom',
          'transformIgnorePatterns': [
            'node_modules/(?!@okta|@react-native|react-native)'
          ],
          'testMatch': ['**/tests/*.js?(x)', '**/?(*.)(spec|test).js?(x)'],
          'setupFiles': [
            './setupJest.js'
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
          const ios11 = podfile.toString('utf-8').replace('platform :ios, \'10.0\'', 'platform :ios, \'11.0\'');
          host.overwrite('ios/Podfile', ios11);
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
      move(getSystemPath(templatesPath))
    ]);

    // Chain the rules and return
    return chain([
      options && options.skipPackageJson ? noop() : addPackageJsonDependencies(framework, options),
      options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ]);
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

export function ionicRemoteConfig(configUri: string) {
  return `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  private authConfig;

  constructor(private http: HttpClient) { }

  loadAuthConfig() {
    return this.http.get(\`\${environment.apiUrl}/${configUri}\`)
      .toPromise()
      .then(data => {
        this.authConfig = data;
        // Override issuer and client ID with values from API
        environment.oidcConfig.server_host = this.authConfig.issuer;
        environment.oidcConfig.client_id = this.authConfig.clientId;
      }).catch((error) => {
        console.error('Failed to fetch remote OIDC configuration.');
        console.error(error);
      });
  }

  getConfig() {
    return this.authConfig;
  }
}`;
}

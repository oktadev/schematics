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
import { dependencies as sdkVersions } from '../package.json';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { addModuleImportToModule } from '@angular/cdk/schematics';
import ncu from 'npm-check-updates';

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
const OKTA_VUE_VERSION = sdkVersions['@okta/okta-vue'];
const IONIC_APPAUTH_VERSION = sdkVersions['ionic-appauth'];
const IONIC_CAPACITOR_BROWSER_VERSION = sdkVersions['@capacitor/browser'];
const IONIC_CAPACITOR_COMMUNITY_HTTP_VERSION = sdkVersions['@capacitor-community/http'];
const IONIC_CAPACITOR_PREFERENCES_VERSION = sdkVersions['@capacitor/preferences'];
const IONIC_CAPACITOR_SECURE_STORAGE_VERSION = sdkVersions['capacitor-secure-storage-plugin'];
const IONIC_CAPACITOR_SPLASH_SCREEN_VERSION = sdkVersions['@capacitor/splash-screen'];
const EXPRESS_SESSION_VERSION = sdkVersions['express-session'];
const OKTA_OIDC_MIDDLEWARE_VERSION = sdkVersions['@okta/oidc-middleware'];
const DOTENV_VERSION = sdkVersions['dotenv'];
const AUTH0_ANGULAR_VERSION = sdkVersions['@auth0/auth0-angular'];
const AUTH0_REACT_VERSION = sdkVersions['@auth0/auth0-react'];
const AUTH0_REACT_NATIVE_VERSION = sdkVersions['react-native-auth0'];
const AUTH0_VUE_VERSION = sdkVersions['@auth0/auth0-vue'];
const AUTH0_EXPRESS_VERSION = sdkVersions['express-openid-connect'];
// Vue CLI uses Jest 27 by default, that's why this is version 27.1.3
const TS_JEST_VERSION = sdkVersions['ts-jest'];

function addPackageJsonDependencies(framework: string, options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [];

    if (framework === ANGULAR) {
      if (options.auth0) {
        dependencies.push({type: NodeDependencyType.Default, version: AUTH0_ANGULAR_VERSION, name: '@auth0/auth0-angular'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_ANGULAR_VERSION, name: '@okta/okta-angular'});
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_AUTH_JS_VERSION, name: '@okta/okta-auth-js'});
      }
    } else if (framework === REACT || framework === REACT_TS) {
      if (options.auth0) {
        dependencies.push({type: NodeDependencyType.Default, version: AUTH0_REACT_VERSION, name: '@auth0/auth0-react'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_REACT_VERSION, name: '@okta/okta-react'});
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_AUTH_JS_VERSION, name: '@okta/okta-auth-js'});
      }
      dependencies.push({type: NodeDependencyType.Default, version: REACT_ROUTER_DOM_VERSION, name: 'react-router-dom'});
      if (framework === REACT_TS) {
        dependencies.push({type: NodeDependencyType.Default, version: REACT_ROUTER_DOM_TYPES_VERSION, name: '@types/react-router-dom'});
      }
    } else if (framework === REACT_NATIVE) {
      if (options.auth0) {
        dependencies.push({type: NodeDependencyType.Default, version: AUTH0_REACT_NATIVE_VERSION, name: 'react-native-auth0'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_REACT_NATIVE_VERSION, name: '@okta/okta-react-native'});
      }
      dependencies.push({type: NodeDependencyType.Default, version: EVENTS_VERSION, name: 'events'});
      dependencies.push({type: NodeDependencyType.Dev, version: ENZYME_VERSION, name: 'enzyme'});
      dependencies.push({type: NodeDependencyType.Dev, version: ENZYME_ADAPTER_VERSION, name: 'enzyme-adapter-react-16'});
      dependencies.push({type: NodeDependencyType.Dev, version: ENZYME_ASYNC_VERSION, name: 'enzyme-async-helpers'});
      dependencies.push({type: NodeDependencyType.Dev, version: REACT_DOM_VERSION, name: 'react-dom'});
    } else if (framework === VUE || framework === VUE_TS) {
      if (options.auth0) {
        dependencies.push({type: NodeDependencyType.Default, version: AUTH0_VUE_VERSION, name: '@auth0/auth0-vue'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_VUE_VERSION, name: '@okta/okta-vue'});
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_AUTH_JS_VERSION, name: '@okta/okta-auth-js'});
      }
      dependencies.push({type: NodeDependencyType.Dev, version: TS_JEST_VERSION, name: 'ts-jest'});
    } else if (framework === IONIC_ANGULAR) {
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_APPAUTH_VERSION, name: 'ionic-appauth'});
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_CAPACITOR_BROWSER_VERSION, name: '@capacitor/browser'});
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_CAPACITOR_COMMUNITY_HTTP_VERSION, name: '@capacitor-community/http'});
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_CAPACITOR_PREFERENCES_VERSION, name: '@capacitor/preferences'});
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_CAPACITOR_SPLASH_SCREEN_VERSION, name: '@capacitor/splash-screen'});
      dependencies.push({type: NodeDependencyType.Default, version: IONIC_CAPACITOR_SECURE_STORAGE_VERSION, name: 'capacitor-secure-storage-plugin'});
    } else if (framework === EXPRESS) {
      if (options.auth0) {
        dependencies.push({type: NodeDependencyType.Default, version: AUTH0_EXPRESS_VERSION, name: 'express-openid-connect'});
      } else {
        dependencies.push({type: NodeDependencyType.Default, version: EXPRESS_SESSION_VERSION, name: 'express-session'});
        dependencies.push({type: NodeDependencyType.Default, version: OKTA_OIDC_MIDDLEWARE_VERSION, name: '@okta/oidc-middleware'});
      }

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
export const IONIC_ANGULAR = 'ionic/angular';
export const EXPRESS = 'express';

function getFramework(host: Tree): string {
  let possibleFiles = ['/package.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find path: ${path}`);
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
  return async (host: Tree) => {
    // allow passing the framework in (for testing)
    let framework = options.framework;

    // if no framework defined, try to detect it
    if (!framework) {
      framework = getFramework(host);
    }

    let projectPath = './';

    if (options.auth0) {
      // convert issuer to domain for some Auth0 SDKs
      if ([ANGULAR, REACT, REACT_TS, VUE, VUE_TS, REACT_NATIVE].includes(framework) && options.issuer.startsWith('https://')) {
        options.issuer = options.issuer.substring(8);
        // Check to see if an Okta issuer is used
        if (options.issuer.indexOf('/') > -1) {
          options.issuer = options.issuer.substring(0, options.issuer.indexOf('/'));
        }
      } else {
        // remove trailing slash
        if (options.issuer.indexOf('/') > -1) {
          options.issuer = options.issuer.substring(0, options.issuer.lastIndexOf('/'));
        }
      }
    }

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
      // add a package name from the issuer for Okta
      const parts = options.issuer.split('.');
      if (options.issuer.indexOf('.') === -1 || options.auth0) {
        // hard-code a package name for localhost
        options.packageName = 'dev.localhost.ionic';
      } else {
        options.packageName =
          parts[2].substring(0, parts[2].indexOf('/')) + '.'
          + parts[1] + '.'
          + parts[0].substring(parts[0].lastIndexOf('/') + 1);
      }

      // add imports to app.module.ts
      // addModuleImportToModule no longer works, not sure why.
      // Error: Cannot read properties of undefined (reading 'kind')
      // addModuleImportToModule(host, 'src/app/app.module.ts', 'HttpClientModule', '@angular/common/http');
      // addModuleImportToModule(host, 'src/app/app.module.ts', 'AuthModule', './auth/auth.module');
      const appModule: Buffer | null = host.read('./src/app/app.module.ts');
      if (appModule) {
        let authConfig: string = appModule.toString();
        authConfig = authConfig.replace("import { AppComponent } from './app.component';", `import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { AuthModule } from './auth/auth.module';`);
        authConfig = authConfig.replace('AppRoutingModule]',
          `AppRoutingModule, HttpClientModule, AuthModule]`);
        host.overwrite('./src/app/app.module.ts', authConfig);
      }

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

      // add port 8100 to npm start command
      const content: Buffer | null = host.read('./package.json');
      if (content) {
        const pkgJson: any = JSON.parse(content.toString());
        pkgJson.scripts.start = pkgJson.scripts.start + ' --port 8100';
        host.overwrite('./package.json', JSON.stringify(pkgJson));
      }
    }

    if (framework === REACT || framework === REACT_TS) {
      const content: Buffer | null = host.read('./package.json');
      if (content) {
        const pkgJson: any = JSON.parse(content.toString());
        // workaround for Create React App not supporting Jest's testEnvironment and setupFiles
        pkgJson.scripts.test = 'react-scripts test --env=jsdom --setupFiles=./src/jest.setup.js'
        host.overwrite('./package.json', JSON.stringify(pkgJson));
      }
    }

    if (framework === REACT_NATIVE) {
      if (!options.auth0) {
        // add a package name from the issuer
        const parts = options.issuer.split('.');
        options.packageName = parts[2].substring(0, parts[2].indexOf('/')) + '.'
          + parts[1] + '.' + parts[0].substring(parts[0].lastIndexOf('/') + 1);
      }
      const content: Buffer | null = host.read('./package.json');
      let appName;
      if (content) {
        const pkgJson: any = JSON.parse(content.toString());
        appName = pkgJson.name;
        // add jest config for tests
        pkgJson.jest = {
          'preset': 'react-native',
          'automock': false,
          'transformIgnorePatterns': [
            `node_modules/(?!@${options.auth0 ? 'auth0' : 'okta'}|@react-native|react-native)`
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
        // delete the jest.config.js file that comes from react-native init
        if (host.read('./jest.config.js') != null) {
          host.delete('./jest.config.js');
        }
      }

      // Configure Gradle for App
      const appBuild: Buffer | null = host.read('./android/app/build.gradle');
      if (appBuild) {
        let manifestPlaceholders;
        if (options.auth0) {
          manifestPlaceholders = `auth0Domain: "${options.issuer}", auth0Scheme: "\${applicationId}.auth0"`
        } else {
          manifestPlaceholders = `appAuthRedirectScheme: "${options.packageName}"`
        }
        const redirectScheme = appBuild.toString('utf-8')
          .replace('versionName "1.0"', `versionName "1.0"\n        manifestPlaceholders = [ ${manifestPlaceholders} ]`);
        host.overwrite('android/app/build.gradle', redirectScheme);
      }

      // Configure iOS for Auth0
      if (options.auth0 && appName) {
        // Configure Gradle for App
        const infoPlist: Buffer | null = host.read(`./ios/${appName}/Info.plist`);
        if (infoPlist) {
          const iosURLs = infoPlist.toString('utf-8')
            .replace('<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>', `<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
\t<key>CFBundleURLTypes</key>
\t<array>
\t\t<dict>
\t\t\t<key>CFBundleTypeRole</key>
\t\t\t<string>None</string>
\t\t\t<key>CFBundleURLName</key>
\t\t\t<string>auth0</string>
\t\t\t<key>CFBundleURLSchemes</key>
\t\t\t<array>
\t\t\t\t<string>$(PRODUCT_BUNDLE_IDENTIFIER).auth0</string>
\t\t\t</array>
\t\t</dict>
\t</array>`);
          host.overwrite(`ios/${appName}/Info.plist`, iosURLs);

          // Update Podfile to require iOS 13
          const podfile: Buffer | null = host.read(`./ios/Podfile`);
          if (podfile) {
            const podfileContents = podfile.toString('utf-8')
                .replace('platform :ios, min_ios_version_supported', 'platform :ios, \'13.0\'');
            host.overwrite(`ios/Podfile`, podfileContents);
          }
        }
      }

      // Force npm 6 peer dependencies, otherwise
      // Could not resolve dependency:
      // peer react@"^16.0.0-0" from enzyme-adapter-react-16@1.1
      host.create('.npmrc', 'legacy-peer-deps=true');
    }

    if (framework === EXPRESS) {
      // Upgrade ancient dependencies used by express-generator
      const contents: Buffer | null = host.read('./package.json');
      if (contents) {
        const packageJson = JSON.parse(contents.toString());
        packageJson.dependencies = await ncu({
          packageData: packageJson,
          upgrade: true
        });
        host.overwrite('./package.json', JSON.stringify(packageJson));
      }
    }
    // Ionic shares templates for Auth0 and Okta, so calculate the path accordingly
    const appTemplatePath = (framework === IONIC_ANGULAR) ? '' : (options.auth0) ? 'auth0/' : 'okta/';

    // Setup templates to add to the project
    const sourceDir = (framework !== REACT_NATIVE && framework !== EXPRESS) ? 'src' : '';
    const sourcePath = join(normalize(projectPath), sourceDir);
    const templatesPath = join(sourcePath, '');
    const templateSourcePath = `./${appTemplatePath}${framework}/${sourceDir}`;
    const templateSource = apply(url(templateSourcePath), [
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

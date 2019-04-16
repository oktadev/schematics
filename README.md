[![Support](https://img.shields.io/badge/support-developer%20forum-blue.svg)][devforum] [![npm version](https://img.shields.io/npm/v/@oktadev/schematics.svg)](https://www.npmjs.com/package/@oktadev/schematics)
 [![Build Status](https://travis-ci.org/oktadeveloper/schematics.svg?branch=master)](https://travis-ci.org/oktadeveloper/schematics)

# OktaDev Schematics

This repository is a Schematics implementation that allows you to easily integrate Okta into your Angular, React, and Vue projects.

**Prerequisites:** [Node.js](https://nodejs.org/). 

* [Angular](#angular) | [React](#react) | [Vue](#vue) | [Ionic](#ionic)
* [Testing](#vue)
* [Contributing](#contributing)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Angular 

First, create an empty project with Angular CLI. You **must** add Angular routing for this schematic to work.

```
npm i -g @angular/cli
ng new secure-angular --routing
cd secure-angular
```

### Add an OpenID Connect Client in Okta

* Log into the Okta Developer Dashboard (or [create an account](https://developer.okta.com/signup) if you don't have one), click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, add `http://localhost:4200/implicit/callback` as a Login redirect URI, and click **Done**.

In your `secure-angular` project, add `@oktadev/schematics`:

```
ng add @oktadev/schematics
```

You'll be prompted for an issuer, which you can find at **API** > **Authorization Servers**. For the client ID, use the Client ID from the app you created in Okta.

See the [Okta Angular SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-angular) for more information.

## React

Create a new project with Create React App.

```
npx create-react-app secure-react
cd secure-react
```

If you'd like to use TypeScript, add the `--typescript` flag.

```
npx create-react-app secure-react --typescript
cd secure-react
```

### Add an OpenID Connect Client in Okta

* Log into the Okta Developer Dashboard (or [create an account](https://developer.okta.com/signup) if you don't have one), click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, add `http://localhost:3000/implicit/callback` as a Login redirect URI, and click **Done**.

Install Schematics globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your `secure-react` project.

```
npm i @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

You'll be prompted for an issuer, which you can find at **API** > **Authorization Servers**. For the client ID, use the Client ID from the app you created in Okta.

See the [Okta React SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react) for more information.

## Vue

Create a new project with Vue CLI. You **must** add routing for this schematic to work. If you specify TypeScript, a `src/router.ts` will be used.

```
npm i -g @vue/cli
vue create secure-vue
cd secure-vue
```

### Add an OpenID Connect Client in Okta

* Log into the Okta Developer Dashboard (or [create an account](https://developer.okta.com/signup) if you don't have one), click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform and click **Done**.

Install Schematics globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your `secure-vue` project.

```
npm i @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

You'll be prompted for an issuer, which you can find at **API** > **Authorization Servers**. For the client ID, use the Client ID from the app you created in Okta.

See the [Okta Vue SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-vue) for more information.

## Ionic

Create a new Ionic + Angular project with Ionic CLI. You **must** use the `tabs` layout for everything to work currently. 

```
npm install -g ionic
ionic start $appName tabs
cd $appName
```

**NOTE:** You can switch to Capacitor by passing in `--platform=capacitor`. The default is Cordova. 

You will an `issuer` and `clientId` to begin. You can obtain those from Okta by completing the following steps.

### Create an Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

From the **Applications** page, choose **Add Application**. On the Create New Application page, select **SPA**. Give your app a memorable name, and configure it as follows:
 
* Login redirect URIs: 
  * `http://localhost:8100/implicit/callback`
  * `com.okta.dev-737523:/callback` (where `dev-737523.okta.com` is your Okta URL)
* Grant type allowed: **Authorization Code**
* Click **Done**
* Click **Edit** and add Logout redirect URIs:
  * `http://localhost:8100/implicit/logout`
  * `com.okta.dev-737523:/logout`
* Click **Save**

Copy your issuer (found under **API** > **Authorization Servers**), and client ID into the following command and run it:

```
ng add @oktadev/schematics --issuer=$issuer --clientId=$clientId
```

You can also use the following syntax:

```
npm i @oktadev/schematics
ng g @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
```

Start your app and you should be able to authenticate with Okta. 🎉

```
ionic serve
```

### iOS

If you ran `ng add @oktadev/schematics` without a `--platform` parameter, your project has been configured for Cordova. Generate a native project with the following command:

```
ionic cordova prepare ios
```

Open your project in Xcode, configure code signing, and run your app.

```
open platforms/ios/MyApp.xcworkspace
```

If you want to use Capacitor, you **must** integrate this library with `ng add @oktadev/schematics --platform=capacitor`.

Then, run:

```
npm run build
ionic capacitor add ios
```

Open your project in Xcode, configure code signing, and run your app.

```
ionic capacitor open ios
```

### Android

If you ran `ng add @oktadev/schematics` without a `--platform` parameter, your project has been configured for Cordova. Generate a native project with the following command:

```
ionic cordova prepare android
```

If you want to use Capacitor, you **must** add this library with `ng add @oktadev/schematics --platform=capacitor`.

Then, run:

```
npm run build
ionic capacitor add android
```

Open your project in Android Studio and run your app.

```
ionic capacitor open android
```

See [Ionic's iOS](https://ionicframework.com/docs/building/ios) and [Android Development](https://ionicframework.com/docs/building/android) docs for more information.

## Testing

This project supports unit tests and integration tests.

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

`./test-app.sh angular` will create an Angular project with Angular CLI, install this project, and make sure all the project's tests pass. Other options include `react`, `react-ts`, `vue`, and `vue-ts`.

`./test-all.sh` will test all the options: Angular, React, React with TypeScript, Vue, and Vue with TypeScript.

## Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!

## Contributing

If you'd like to modify this library, and contribute your changes, you can start by forking it to your own GitHub repository. Then, clone it to your hard drive.

```
git clone git@github.com:<your username>/schematics.git
cd schematics
```

Create a new branch for your changes:

```
git checkout -b my-awesome-branch
```

Make the changes you want to make and add tests where appropriate. Create a new project with whatever framework you're using, then run the following command inside it to use your modified project.

```
npm link /path/to/schematics
```

You'll need to run `npm run build` whenever you change anything in the schematics project.

**NOTE:** You can also use `npm pack` in your schematics project, then `npm install /path/to/artifact.tar.gz` in your test project. This mimics `npm install` more than `npm link`.

## Links

This project uses the following open source libraries from Okta:

* [Okta Angular SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-angular)
* [Okta React SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react)
* [Okta Vue SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-vue)

For Ionic, it uses [Ionic AppAuth](https://github.com/wi3land/ionic-appauth).

## Help

Please post any questions as issues or as a question on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).

[devforum]: https://devforum.okta.com


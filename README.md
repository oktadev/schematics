# OktaDev Schematics
[![NPM version][npm-image]][npm-url] [![Build Status][github-actions-image]][github-actions-url] [![Dependency Status][daviddm-image]][daviddm-url] <object id="badge" data="https://snyk-widget.herokuapp.com/badge/npm/%40oktadev%2Fschematics/2.2.0/badge.svg" type="image/svg+xml"></object>
> Fast and easy installation of Okta's OIDC SDKs

This project is a Schematics implementation that allows you to easily integrate Okta into your Angular, React, Vue, Ionic, React Native, and Express projects.

This library currently supports:

- [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1)
- [Proof Key for Code Exchange (PKCE)](https://tools.ietf.org/html/rfc7636)

**Prerequisites:** [Node.js](https://nodejs.org/). 

* [Angular](#angular) | [React](#react) | [Vue](#vue) 
* [Ionic](#ionic) | [React Native](#react-native)
* [Express](#express)
* [Testing](#testing)
* [Contributing](#contributing)
* [Tutorials](#tutorials)
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

### Add an OpenID Connect App in Okta

1. Install the [Okta CLI](https://cli.okta.com)
2. Run `okta register` to create an account, followed by `okta apps create`
3. Choose **Single Page App** and use `http://localhost:4200/callback` for the Redirect URI

In your `secure-angular` project, add `@oktadev/schematics`:

```
ng add @oktadev/schematics
```

Use the values that the Okta CLI provides for the issuer and client ID when prompted.

Run `npm start`, open `http://localhost:4200` in your browser, and sign in. 🥳

See the [Okta Angular SDK](https://github.com/okta/okta-angular) for more information.

You can also use the Okta Admin Console:

* Log in to your Okta instance (or [create an account](https://developer.okta.com/signup) if you don't have one). Go to **Applications** > **Applications** > **Add Application** > **Create New App**.
* Choose **Single Page App (SPA)** as the platform and click **Create**.
* Add `http://localhost:4200/callback` as a Login redirect URI and `http://localhost:4200` as a Logout redirect URI.
* Go to your app's **Assignments** tab, **Assign** > **Assign to Groups** and select the **Everyone** group.
* You'll also need to add `http://localhost:4200` as a Trusted Origin in **Security** > **API** > **Trusted Origins**.

## React

Create a new project with Create React App.

```
npx create-react-app secure-react
cd secure-react
```

If you'd like to use TypeScript, add the `--template typescript` flag.

```
npx create-react-app secure-react --template typescript
cd secure-react
```

### Add an OpenID Connect App in Okta

1. Install the [Okta CLI](https://cli.okta.com)
2. Run `okta register` to create an account, followed by `okta apps create`
3. Choose **Single Page App** and use `http://localhost:3000/callback` for the Redirect URI

Install the Schematics CLI globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your `secure-react` project.

```
npm i @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

Use the values that the Okta CLI provides for the issuer and client ID when prompted.

Run `npm start`, open `http://localhost:3000` in your browser, and sign in. 🎉

See the [Okta React SDK](https://github.com/okta/okta-react) for more information.

You can also use the Okta Admin Console:

* Log in to your Okta instance (or [create an account](https://developer.okta.com/signup) if you don't have one). Go to **Applications** > **Applications** > **Add Application** > **Create New App**.
* Choose **Single Page App (SPA)** as the platform and click **Create**.
* Add `http://localhost:3000/callback` as a Login redirect URI and `http://localhost:3000` as a Logout redirect URI.
* Go to your app's **Assignments** tab, **Assign** > **Assign to Groups** and select the **Everyone** group.
* You'll also need to add `http://localhost:3000` as a Trusted Origin in **Security** > **API** > **Trusted Origins**.

## Vue

Create a new project with Vue CLI. You **must** add routing for this schematic to work. If you specify TypeScript, a `src/router.ts` will be used.

```
npm i -g @vue/cli
vue create secure-vue
cd secure-vue
```

### Add an OpenID Connect App in Okta

1. Install the [Okta CLI](https://cli.okta.com)
2. Run `okta register` to create an account, followed by `okta apps create`
3. Choose **Single Page App** and use `http://localhost:8080/callback` for the Redirect URI

Install the Schematics CLI globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your `secure-vue` project.

```
npm i -D @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

Use the values that the Okta CLI provides for the issuer and client ID when prompted.

Run `npm run serve`, open `http://localhost:8080` in your browser, and sign in. 💥

See the [Okta Vue SDK](https://github.com/okta/okta-vue) for more information.

You can also use the Okta Admin Console:

* Log in to your Okta instance (or [create an account](https://developer.okta.com/signup) if you don't have one). Go to **Applications** > **Applications** > **Add Application** > **Create New App**.
* Choose **Single Page App (SPA)** as the platform and click **Create**.
* Add `http://localhost:8080/callback` as a Login redirect URI and `http://localhost:8080` as a Logout redirect URI.
* Go to your app's **Assignments** tab, **Assign** > **Assign to Groups** and select the **Everyone** group.
* You'll also need to add `http://localhost:8080` as a Trusted Origin in **Security** > **API** > **Trusted Origins**.

## Ionic

Create a new Ionic + Angular project with Ionic CLI. You **must** use the `tabs` layout for everything to work currently. 

```
npm install -g @ionic/cli
ionic start secure-ionic tabs --type=angular --no-interactive
cd secure-ionic
```

You will need an `issuer` and a `clientId` to begin. You can obtain those from Okta by completing the following steps.

> **NOTE:** OIDC Login for Ionic is possible thanks to the excellent [Ionic AppAuth](https://github.com/wi3land/ionic-appauth#readme) project and its examples. This integration is not Okta-specific and should work with any identity provider that supports PKCE for browser and mobile apps.

### Create an Application in Okta

1. Install the [Okta CLI](https://cli.okta.com)
2. Run `okta register` to create an account, followed by `okta apps create`
3. Choose **Native** and use `[com.okta.dev-737523:/callback,http://localhost:8100/callback]` for the Login redirect URIs (where `dev-737523.okta.com` is your Okta Org URL)
4. Use `[com.okta.dev-737523:/logout,http://localhost:8100/logout]` for the Login redirect URIs

In your `secure-ionic` project, add `@oktadev/schematics`:

```
ng add @oktadev/schematics
```

Use the values that the Okta CLI provides for the issuer and client ID when prompted.

**NOTE:** You can switch to Cordova by passing in `--platform=cordova`. The default is Capacitor.

Start your app and authenticate with Okta. 🎉

```
ionic serve
```

You can also use the Okta Admin Console:

Log in to your Okta instance (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

From the **Applications** page, choose **Add Application** > **Create New App**. On the Create New Application page, select **Native**. Give your app a memorable name, and configure it as follows:

* Login redirect URIs:
  * `http://localhost:8100/callback`
  * `com.okta.dev-737523:/callback` (where `dev-737523.okta.com` is your Okta Org URL)
* Logout redirect URIs:
  * `http://localhost:8100/logout`
  * `com.okta.dev-737523:/logout`
* Click **Save**

You will also need to add `http://localhost:8100` as a Trusted Origin in **API** > **Trusted Origins**.

### iOS

If you ran `ng add @oktadev/schematics` without a `--platform` parameter, your project has been configured for Capacitor. Build and add Capacitor for iOS with the following commands:

```
ionic build
npx cap add ios
```

Open your project in Xcode and configure code signing.

```
npx cap open ios
```

Add your custom scheme to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.getcapacitor.capacitor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>capacitor</string>
      <string>com.okta.dev-737523</string>
    </array>
  </dict>
</array>
```

Then run your app from Xcode.

### iOS and Cordova

If you want to use Cordova, you **must** integrate this library with `ng add @oktadev/schematics --platform=cordova`.

Then, generate a native project with the following command:

```
ionic cordova prepare ios
```

Open your project in Xcode, configure code signing, and run your app.

```
open platforms/ios/MyApp.xcworkspace
```

### Android

If you ran `ng add @oktadev/schematics` without a `--platform` parameter, your project has been configured for Capacitor. Build and add Capacitor for Android with the following commands:

```
ionic build
npx cap add android
```

Change the custom scheme in `android/app/src/main/res/values/strings.xml` to use your reverse domain name:

```xml
<string name="custom_url_scheme">com.okta.dev-737523</string>
```

The [SafariViewController Cordova Plugin](https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller) is installed as part of this project. Capacitor uses AndroidX dependencies, but the SafariViewController plugin uses an older non-AndroidX dependency. Use [jetifier](https://developer.android.com/studio/command-line/jetifier) to [patch usages of old support libraries](https://capacitorjs.com/docs/android/troubleshooting#error-package-android-support-does-not-exist) with the following commands:

```
npm install jetifier
npx jetify
npx cap sync android
```   

Then, open your project in Android Studio and run your app.

```
npx cap open android
```

### Android and Cordova

If you want to use Cordova, you **must** add this library with `ng add @oktadev/schematics --platform=cordova`.

Then, generate a native project with the following command:

```
ionic cordova prepare android
```

Set the launchMode to `singleTask` so the URL does not trigger a new instance of the app in `platforms/android/app/src/main/AndroidManifest.xml`:

```
android:launchMode="singleTask"
```

Open `platforms/android` in Android Studio and run your app.

If you get a Gradle error in Android Studio, go to **File** > **Project Structure** and change the Android Gradle Plugin to `4.0.1`. Kudos to [Stack Overflow](https://stackoverflow.com/a/63206864).

See [Ionic's iOS](https://ionicframework.com/docs/developing/ios) and [Android Development](https://ionicframework.com/docs/developing/android) docs for more information.

## React Native

Create a new React Native project with the React Native CLI. 

```
npx react-native init SecureApp
```

You will need an `issuer` and a `clientId` to begin. You can obtain those from Okta by completing the following steps.

### Create an Application in Okta

1. Install the [Okta CLI](https://cli.okta.com)
2. Run `okta register` to create an account, followed by `okta apps create`
3. Choose **Native** and accept the default Redirect URI
4. Modify the Post Logout Redirect URI to match the default Redirect URI (e.g., `com.okta.dev-123456:/callback`).

Install the Schematics CLI globally.

```
npm install -g @angular-devkit/schematics-cli
```

Install and run the `add-auth` schematic in your `SecureApp` project. 

```
cd SecureApp
npm i -D @oktadev/schematics
schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
```

You can also use the Okta Admin Console:

* Log in to your Okta instance (or [create an account](https://developer.okta.com/signup) if you don't have one). Go to **Applications** > **Applications** > **Add Application** > **Create New App**.
* Choose **Native** as the platform and click **Create**.
* Add `com.okta.dev-123456:/callback` as a Login redirect URI and `com.okta.dev-123456:/callback` as a Logout redirect URI (where `dev-123456.okta.com` is your Okta domain).
* Go to your app's **Assignments** tab, **Assign** > **Assign to Groups** and select the **Everyone** group.

### iOS

Run `pod install --project-directory=ios` to install the [Okta OIDC iOS SDK](https://github.com/okta/okta-oidc-ios).

Start your app and authenticate with Okta. 🎉

```
npm run ios
```

### Android

One change is made to Android build files to integrate the [Okta OIDC Android SDK](https://github.com/okta/okta-oidc-android). 

* In `android/app/build.gradle`, an `appAuthRedirectScheme` is added in `android` > `defaultConfig`.

Since this modification is done for you, you can simply start your app and authenticate with Okta. 🎊

```
npm run android
```

For more information, see the [Okta React Native SDK documentation](https://github.com/okta/okta-react-native#readme).

## Express

Create a new project with express-generator and pug.

```
mkdir express-app
cd express-app
npx express-generator --view=pug
```

### Add an OpenID Connect App in Okta

1. Install the [Okta CLI](https://cli.okta.com)
2. Run `okta register` to create an account, followed by `okta apps create`
3. Choose **Web** > **Other** and use `http://localhost:3000/callback` for the Redirect URI
4. Accept the default Post Logout Redirect URI (`http://localhost:3000`)

Install the Schematics CLI globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your `express-app` project. 

The Okta CLI will create an `.okta.env` file in the current directory. It will have the values you need. After you use them in the command below, you can delete this file.

```
npm i -D @oktadev/schematics
schematics @oktadev/schematics:add-auth --issuer=$issuer \
  --clientId=$clientId --clientSecret=$clientSecret
```

🚨 This process will create an `.env` file will be generated with your Okta credentials. Make sure to add `*.env` to `.gitignore` and don't check it into source control!

Start your app and authenticate with Okta at `http://localhost:3000`. 🎊

```
npm start
```

See the [Okta OIDC Middleware SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware#readme) for more information.

You can also create your app using the Okta Admin Console:

* Log into the Okta Developer Dashboard (or [create an account](https://developer.okta.com/signup) if you don't have one), click **Applications** then **Add Application** > **Create New App**.
* Choose **Web** as the platform, select **OpenID Connect**, and click **Create**.
* Add a Login redirect URI of `http://localhost:3000/callback`.
* Add a Logout redirect URI of `http://localhost:3000`.
* Click **Save**.

## Testing

This project supports unit tests and integration tests.

`npm test` will run the unit tests, using Jasmine as a runner and test framework.

`./test-app.sh angular` will create an Angular project with Angular CLI, install this project, and make sure all the project's tests pass. Other options include `react`, `react-ts`, `vue`, `vue-ts`, `ionic`, `ionic-cordova`, `react-native`, and `express`.

`./test-all.sh` will test all the options: Angular, React, React with TypeScript, Vue, Vue with TypeScript, Ionic with Cordova, Ionic with Capacitor, React Native, and Express.

## Publishing

To publish, simply do:

```bash
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

## Tutorials

See the following blog posts to see OktaDev Schematics in action.

* [Use Angular Schematics to Simplify Your Life](https://developer.okta.com/blog/2019/02/13/angular-schematics)
* [Use Schematics with Vue and Add Authentication in 5 Minutes](https://developer.okta.com/blog/2019/05/21/vue-schematics)
* [Use Schematics with React and Add OpenID Connect Authentication in 5 Minutes](https://developer.okta.com/blog/2019/03/05/react-schematics)
* [Tutorial: User Login and Registration in Ionic 4](https://developer.okta.com/blog/2019/06/20/ionic-4-tutorial-user-authentication-and-registration)
* [Create a React Native App with Login in 10 Minutes](https://developer.okta.com/blog/2019/11/14/react-native-login)

## Links

This project uses the following open source libraries from Okta:

* [Okta Angular SDK](https://github.com/okta/okta-angular)
* [Okta React SDK](https://github.com/okta/okta-react)
* [Okta Vue SDK](https://github.com/okta/okta-vue)
* [Okta React Native SDK](https://github.com/okta/okta-react-native)

For Ionic, it uses [Ionic AppAuth](https://github.com/wi3land/ionic-appauth).

## Help

Please post any questions as issues or ask them on the [Okta Developer Forums][devforum-url].

## License

Apache 2.0, see [LICENSE](LICENSE).

[npm-image]: https://img.shields.io/npm/v/@oktadev/schematics.svg
[npm-url]: https://www.npmjs.com/package/@oktadev/schematics
[github-actions-image]: https://github.com/oktadeveloper/schematics/workflows/Schematics/badge.svg
[github-actions-url]: https://github.com/oktadeveloper/schematics/actions
[daviddm-image]: https://david-dm.org/oktadeveloper/schematics.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/oktadeveloper/schematics
[devforum-image]: https://img.shields.io/badge/support-developer%20forum-blue.svg
[devforum-url]: https://devforum.okta.com

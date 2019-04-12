# Ionic 4 OIDC Login Example

This example shows how to use [Ionic AppAuth](https://github.com/wi3land/ionic-appauth) and authenticate using Okta. The majority of its code comes from [@wi3land/ionic-appauth-ng-demo](https://github.com/wi3land/ionic-appauth-ng-demo). 

**Prerequisites:** [Node 11](https://nodejs.org/) and [Ionic 4](https://ionicframework.com/). After installing Node, install Ionic's CLI:

```
npm i -g ionic
```

* [Getting Started](#getting-started)
* [Configure for Mobile](#mobile)
  * [iOS](#ios)
  * [Android](#android)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

This app was created using the following commands:

```bash
ionic start $name tabs
cd $name
ng add @oktadev/schematics --issuer=$issuer --clientId=$clientId 
```

**NOTE:** You can switch to Capacitor by passing in `--platform=capacitor`. The default is Cordova.


See [Ionic's iOS](https://ionicframework.com/docs/building/ios) and [Android Development](https://ionicframework.com/docs/building/android) docs for more information.

### Create an Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don’t have an account).

From the **Applications** page, choose **Add Application**. On the Create New Application page, select **SPA**.
Give your app a memorable name, and configure it as follows:
 
* Login redirect URIs: 
  * `http://localhost:8100/implicit/callback`
  * `com.okta.dev-737523:/callback` (where `dev-737523.okta.com` is your Okta URL)
* Grant type allowed: **Authorization Code**
* Click **Done**
* Click **Edit** and add Logout redirect URIs:
  * `http://localhost:8100/implicit/logout`
  * `com.okta.dev-737523:/logout`
* Click **Save**

Copy your issuer (found under **API** > **Authorization Servers**), and client ID into `src/app/core/auth.service.ts` as follows:

```ts
private addConfig() {
  const clientId = '{yourClientId}';
  const issuer = 'https://{yourOktaDomain}/oauth2/default';
  const scopes = 'openid profile offline_access';

  if (this.platform.is('cordova')) {
    this.authConfig = {
      identity_client: clientId,
      identity_server: issuer,
      redirect_url: '{yourReversedOktaDomain}:/callback',
      scopes: scopes,
      usePkce: true,
      end_session_redirect_url: '{yourReversedOktaDomain}:/logout',
    };
  }
  ...
}
```

**NOTE:** The value of `{yourOktaDomain}` should be something like `dev-123456.okta.com`. Make sure you don't include `-admin` in the value!

After modifying this file, start the app and you should be able to authenticate with Okta.

```
ionic serve
```

## Mobile

If you'd like to run this app on a mobile emulator or device, you'll need to modify `package.json` to use your reversed Okta domain. 

```xml
"cordova": {
  "plugins": {
    ...
    "cordova-plugin-customurlscheme": {
      "URL_SCHEME": "com.oktapreview.dev-737523",
      ...
    },
  }
}
```

This configures the [Custom URL scheme](https://github.com/EddyVerbruggen/Custom-URL-scheme) Cordova plugin so redirects back to your app will work.

## iOS

You can deploy this app to iOS Simulator using:

```shell
ionic cordova run ios
```

Then, in another terminal:

```
open platforms/ios/MyApp.xcworkspace
```

Configure signing in Xcode, then run the app.

See <https://ionicframework.com/docs/building/ios> for more information.

## Android

You can deploy this app to an AVD (Android Virtual Device) using:

```shell
ionic cordova run android 
```

**NOTE:** You will need to create an AVD using Android Studio first.

## Links

This example uses the following open source libraries:

* [Ionic AppAuth](https://github.com/wi3land/ionic-appauth) 
* [Ionic](https://github.com/ionic-team/ionic)

## Help

Please post any questions as issues in this repository, or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).

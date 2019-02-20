[![Support](https://img.shields.io/badge/support-developer%20forum-blue.svg)][devforum] [![npm version](https://img.shields.io/npm/v/@oktadev/schematics.svg)](https://www.npmjs.com/package/@oktadev/schematics)
 [![Build Status](https://travis-ci.org/oktadeveloper/schematics.svg?branch=master)](https://travis-ci.org/oktadeveloper/schematics)

# OktaDev Schematics

This repository is a Schematics implementation that allows you to easily integrate Okta into your Angular, React, and Vue projects.

**Prerequisites:** [Node.js](https://nodejs.org/). 

* [Angular](#angular) | [React](#react) | [Vue](#vue)
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

Then in your new project, add `@oktadev/schematics`:

```
ng add @oktadev/schematics
```

You can also use the following syntax:

```
npm i @oktadev/schematics
ng g @oktadev/schematics:add-auth
```

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

Install Schematics globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your project.

```
npm i @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

See the [Okta React SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react) for more information.

## Vue

Create a new project with Vue CLI. You **must** add routing for this schematic to work. If you specify TypeScript, a `src/router.ts` will be used.

```
npm i -g @vue/cli
vue create secure-vue
cd secure-vue
```

Install Schematics globally.

```
npm install -g @angular-devkit/schematics-cli
```

Then install and run the `add-auth` schematic in your project.

```
npm i @oktadev/schematics
schematics @oktadev/schematics:add-auth
```

See the [Okta Vue SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-vue) for more information.

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

## Help

Please post any questions as issues or as a question on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).

[devforum]: https://devforum.okta.com


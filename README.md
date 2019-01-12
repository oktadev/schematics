[![Support](https://img.shields.io/badge/support-developer%20forum-blue.svg)][devforum] [![Build Status](https://travis-ci.org/oktadeveloper/schematics.svg?branch=master)](https://travis-ci.org/oktadeveloper/schematics)

# OktaDev Schematics

This repository is a Schematics implementation that allows you to easily integrate Okta into your Angular projects.


To use it, create an empty project with Angular CLI. You **must** add Angular routing for this schematic to work.
This repository is a Schematics implementation that allows you to easily integrate Okta into your Angular, React, and Vue projects. You can start using it by cloning it to your hard drive.

```
ng new my-secure-app --routing
git clone git@github.com:oktadeveloper/schematics.git
cd schematics
npm link
```

Then in your new project, add `@oktadev/schematics`:
## Angular 

First, create an empty project with Angular CLI. You **must** add Angular routing for this schematic to work.

```
ng add @oktadev/schematics
```

You can also use the following syntax:

```
npm i @oktadev/schematics
ng g @oktadev/schematics:add-auth
ng g @oktadev/schematics:add-auth
```

Or, simply `ng add @oktadev/schematics`.

## React

## Vue

### Testing

This project supports unit tests and integration tests.

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

`./test-app.sh angular` will create an Angular project with Angular CLI, install this project, and make sure all the project's tests pass.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!

[devforum]: https://devforum.okta.com

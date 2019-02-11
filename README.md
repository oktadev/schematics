[![Support](https://img.shields.io/badge/support-developer%20forum-blue.svg)][devforum] [![Build Status](https://travis-ci.org/oktadeveloper/schematics.svg?branch=master)](https://travis-ci.org/oktadeveloper/schematics)

# OktaDev Schematics

This repository is a Schematics implementation that allows you to easily integrate Okta into your Angular, React, and Vue projects.

## Angular 

First, create an empty project with Angular CLI. You **must** add Angular routing for this schematic to work.

```
ng new my-secure-app --routing
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

### Contributing

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

[devforum]: https://devforum.okta.com


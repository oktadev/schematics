[![Support](https://img.shields.io/badge/support-developer%20forum-blue.svg)][devforum] [![Build Status](https://travis-ci.org/oktadeveloper/okta-shield.svg?branch=master)](https://travis-ci.org/oktadeveloper/okta-shield)

# Okta Shield

This repository is a Schematic implementation that allows you to easily integrate Okta into your Angular projects. You can start using it by cloning it to your hard drive.

```
git clone git@github.com:oktadeveloper/okta-shield.git
cd okta-shield
npm link
```

First, create an empty project with Angular CLI. You **must** add Angular routing for this schematic to work.

```
ng new my-secure-app
```

Then in your new project, run the `add-auth` schematic:

```
ng g @okta/shield:add-auth
```

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!

[devforum]: https://devforum.okta.com

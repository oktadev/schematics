#!/usr/bin/env bash

framework="$1"

# build and package this project
npm run build
npm pack

# create directory to store created apps
mkdir apps
cd apps

if [ "$1" == "angular" ] || [ "$1" == "a" ]
then
  ng new angular-app --routing --style css
  cd angular-app
  npm install ../../oktadev*.tgz
  ng add @oktadev/schematics --issuer=https://developer.okta.com --clientId=foobar
  ng test --watch=false && ng e2e
elif [ "$1" == "react" ] || [ "$1" == "r" ]
then
  npx create-react-app react-app --typescript
  cd react-app
  npm install ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=https://developer.okta.com --clientId=foobar
  CI=true npm test
fi

#!/usr/bin/env bash

framework="$1"
issuer="https://dev-737523.oktapreview.com/oauth2/default"
clientId="0oaj68gvwfOWDh9Yd0h7"

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
elif [ "$1" == "react-ts" ] || [ "$1" == "rts" ]
then
  npx create-react-app react-app-ts --typescript
  cd react-app-ts
  npm install ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  CI=true npm test
elif [ "$1" == "react" ] || [ "$1" == "r" ]
then
  npx create-react-app react-app
  cd react-app
  npm install ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  CI=true npm test
fi

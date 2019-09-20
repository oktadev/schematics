#!/usr/bin/env bash

framework="$1"
issuer="https://dev-737523.oktapreview.com/oauth2/default"
clientId="0oakbx29c18zmcNyb0h7"

# build and package this project
npm run build
npm pack

# create directory to store created apps
mkdir -p apps
cd apps

if [ "$1" == "angular" ] || [ "$1" == "a" ]
then
  ng new angular-app --routing --style css
  cd angular-app
  # https://github.com/angular/protractor/issues/5312#issuecomment-530905920
  ./node_modules/protractor/bin/webdriver-manager update --versions.chrome=77.0.3865.75
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  ng test --watch=false && ng e2e
elif [ "$1" == "react-ts" ] || [ "$1" == "rts" ]
then
  npx create-react-app react-app-ts --typescript
  cd react-app-ts
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  CI=true npm test
elif [ "$1" == "react" ] || [ "$1" == "r" ]
then
  npx create-react-app react-app
  cd react-app
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  CI=true npm test
elif [ "$1" == "vue-ts" ] || [ "$1" == "vts" ]
then
  config=$(cat <<EOF
{
  "useConfigFiles": true,
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-typescript": {
      "classComponent": true,
      "tsLint": true,
      "lintOn": [
        "save"
      ],
      "useTsWithBabel": true
    },
    "@vue/cli-plugin-unit-jest": {},
    "@vue/cli-plugin-e2e-cypress": {}
  },
  "router": true,
  "routerHistoryMode": false
}
EOF
)
  vue create vue-app-ts -i "$config"
  cd vue-app-ts
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  npm run test:unit
elif [ "$1" == "vue" ] || [ "$1" == "v" ]
then
  config=$(cat <<EOF
{
  "useConfigFiles": true,
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-eslint": {
      "config": "base",
      "lintOn": [
        "save"
      ]
    },
    "@vue/cli-plugin-unit-jest": {}
  },
  "router": true,
  "routerHistoryMode": true
}
EOF
)
  vue create vue-app -i "$config"
  cd vue-app
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  npm run test:unit
elif [ "$1" == "ionic" ] || [ "$1" == "i" ]
then
  ionic start ionic-cordova tabs --no-interactive
  cd ionic-cordova
  npm install -D ../../oktadev*.tgz
  ng add @oktadev/schematics --issuer=$issuer --clientId=$clientId
  # ng add @oktadev/schematics --configUri=http://localhost:8080/api/auth-info --issuer=1 --clientId=2
  ng test --watch=false
elif [ "$1" == "ionic-cap" ] || [ "$1" == "icap" ]
then
  ionic start ionic-capacitor tabs --no-interactive
  cd ionic-capacitor
  npm install -D ../../oktadev*.tgz
  ng add @oktadev/schematics --issuer=$issuer --clientId=$clientId --platform=capacitor
  ng test --watch=false
fi

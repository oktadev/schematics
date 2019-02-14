#!/usr/bin/env bash

framework="$1"
issuer="https://dev-737523.oktapreview.com/oauth2/default"
clientId="0oaj68gvwfOWDh9Yd0h7"

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
  npm install ../../oktadev*.tgz
  ng add @oktadev/schematics --issuer=$issuer --clientId=$clientId
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
  npm install ../../oktadev*.tgz
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
  npm install ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  npm run test:unit
fi

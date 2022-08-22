#!/usr/bin/env bash

# exit when any command fails
set -e

framework="$1"
issuer="https://dev-17700857.okta.com/oauth2/default"
clientId="0oa66eo2b0gvHGqwR5d7"

# build and package this project
rm -f *.tgz
npm run build
npm pack

# create directory to store created apps
mkdir -p apps
cd apps

# install snapshot version of schematics-utilities
# if [ ! -d schematics-utilities ]; then
#  git clone -b refactor/restore-angular-cdk-clone https://github.com/nitayneeman/schematics-utilities.git
# fi
# cd schematics-utilities && npm link
# cd ..

if [ $framework == "angular" ] || [ $framework == "a" ]
then
  ng new angular-app --routing --style css --strict
  cd angular-app
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  ng test --watch=false
elif [ $framework == "angular-0" ] || [ $framework == "a0" ]
then
  ng new angular-auth0 --routing --style css --strict
  cd angular-auth0
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId --auth0
  ng test --watch=false
elif [ $framework == "react-ts" ] || [ $framework == "rts" ]
then
  npx create-react-app react-app-ts --template typescript
  cd react-app-ts
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  CI=true npm test
elif [ $framework == "react" ] || [ $framework == "r" ]
then
  npx create-react-app react-app
  cd react-app
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  CI=true npm test
elif [ $framework == "vue-ts" ] || [ $framework == "vts" ]
then
  config=$(cat <<EOF
{
  "useConfigFiles": true,
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-typescript": {
      "classComponent": false,
      "useTsWithBabel": true
    },
    "@vue/cli-plugin-router": {
      "historyMode": true
    },
    "@vue/cli-plugin-eslint": {
      "config": "base",
      "lintOn": [
        "save"
      ]
    },
    "@vue/cli-plugin-unit-jest": {}
  },
  "vueVersion": "3"
}
EOF
)
  vue create vue-app-ts -i "$config" --registry=http://registry.npm.taobao.org
  cd vue-app-ts
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  npm run test:unit
elif [ $framework == "vue" ] || [ $framework == "v" ]
then
  config=$(cat <<EOF
{
  "useConfigFiles": true,
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-router": {
      "historyMode": true
    },
    "@vue/cli-plugin-eslint": {
      "config": "base",
      "lintOn": [
        "save"
      ]
    },
    "@vue/cli-plugin-unit-jest": {}
  },
  "vueVersion": "3"
}
EOF
)
  vue create vue-app -i "$config" --registry=http://registry.npm.taobao.org
  cd vue-app
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  npm run test:unit
elif [ $framework == "ionic" ] || [ $framework == "i" ]
then
  ionic start ionic-app tabs --type angular --no-interactive
  cd ionic-app
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  npm run build && ng test --watch=false
elif [ $framework == "ionic-0" ] || [ $framework == "i0" ]
then
  ionic start ionic-auth0 tabs --type angular --no-interactive
  cd ionic-auth0
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId --auth0
  npm run build && ng test --watch=false
elif [ $framework == "react-native" ] || [ $framework == "rn" ]
then
  npx -y react-native init SecureApp
  cd SecureApp
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId
  # pod install --project-directory=ios
  npm test -- -u
elif [ $framework == "express" ] || [ $framework == "e" ]
then
  mkdir express-app && cd express-app
  npx express-generator --view=pug
  npm i
  npm install -D ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --client-id=$clientId --client-secret='may the auth be with you'
  # npm test -- -u
else
  echo "No '${framework}' framework found!"
fi

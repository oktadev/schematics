#!/usr/bin/env bash

framework="$1"

if [ "$1" == "angular" ]
then
  ng new my-secure-app --routing --style CSS
  cd my-secure-app
  npm link @oktadev/schematics
  ng g @oktadev/schematics:add-auth --issuer=https://developer.okta.com --clientId=foobar
  ng test --watch=false && ng e2e
else
  echo "This script only supports Angular at this time."
fi

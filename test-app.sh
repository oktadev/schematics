#!/usr/bin/env bash

framework="$1"

if [ "$1" == "angular" ] || [ "$1" == "a" ]
then
  ng new my-secure-app --routing --style css
  cd my-secure-app
  npm link @oktadev/schematics
  ng add @oktadev/schematics --issuer=https://developer.okta.com --clientId=foobar
  ng test --watch=false && ng e2e
else
  echo "This script only supports Angular at this time."
fi

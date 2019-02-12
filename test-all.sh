#!/usr/bin/env bash
rm -rf apps
./test-app.sh a && ./test-app.sh r && ./test-app.sh r-ts && ./test-app.sh v && ./test-app.sh v-ts

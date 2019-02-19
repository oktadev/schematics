#!/usr/bin/env bash
rm -rf apps
./test-app.sh a && ./test-app.sh r && ./test-app.sh rts && ./test-app.sh v && ./test-app.sh vts

#!/usr/bin/env bash
rm -rf apps
./test-app.sh a && ./test-app.sh r && ./test-app.sh rts && \
./test-app.sh v && ./test-app.sh vts && ./test-app.sh v3 && ./test-app.sh v3ts && \
./test-app.sh i && ./test-app.sh icor && ./test-app.sh rn \
./test-app.sh e

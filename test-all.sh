#!/usr/bin/env bash
rm -rf apps
./test-app.sh a && ./test-app.sh a0 && \
./test-app.sh r && ./test-app.sh rts && \
./test-app.sh v && ./test-app.sh vts && \
./test-app.sh i && ./test-app.sh i0 && \
./test-app.sh rn \
./test-app.sh e

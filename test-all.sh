#!/usr/bin/env bash
rm -rf apps
./test-app.sh a && ./test-app.sh a0 && \
./test-app.sh r && ./test-app.sh rts && \
./test-app.sh r0 && ./test-app.sh rts0 && \
./test-app.sh v && ./test-app.sh vts && \
./test-app.sh v0 && ./test-app.sh vts0 && \
./test-app.sh i && ./test-app.sh i0 && \
./test-app.sh rn && ./test-app.sh rn0 && \
./test-app.sh e && ./test-app.sh e0

// Solves `window.crypto` is required to run `auth0-spa-js`.
// https://github.com/auth0/auth0-spa-js/issues/963
global.crypto = {
  subtle: {
    digest: () => ''
  }
};

// jsdom in react-scripts' Jest doesn't define `TextEncoder` or `fetch`, which `auth0-spa-js` uses since 2.x.
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = global.fetch || (() => Promise.reject(new Error('fetch is not available in tests')));

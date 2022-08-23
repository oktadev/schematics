// Solves `window.crypto` is required to run `auth0-spa-js`.
// https://github.com/auth0/auth0-spa-js/issues/963
global.crypto = {
  subtle: {
    digest: () => ''
  }
};

// Required to correctly polyfill React-Native

global.XMLHttpRequest = jest.fn();
global.fetch = jest.fn();

if (typeof window !== 'object') {
  global.window = global;
  global.window.navigator = {};
}

// react-native-auth0 is a native module, so mock the web auth methods the app uses
jest.mock('react-native-auth0', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    webAuth: {
      authorize: jest.fn().mockResolvedValue({ accessToken: 'access-token' }),
      clearSession: jest.fn().mockResolvedValue(),
    },
  })),
}));

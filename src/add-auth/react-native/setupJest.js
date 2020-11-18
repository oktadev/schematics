// Required to correctly polyfill React-Native

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.XMLHttpRequest = jest.fn();
global.fetch = jest.fn();

if (typeof window !== 'object') {
  global.window = global;
  global.window.navigator = {};
}

import * as ReactNative from 'react-native';

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      NativeModules: {
        ...ReactNative.NativeModules,
        OktaSdkBridge: {
          createConfig: jest.fn(),
          signIn: jest.fn(),
          signOut: jest.fn(),
          getAccessToken: jest.fn(),
          getIdToken: jest.fn(),
          getUser: jest.fn(),
          isAuthenticated: jest.fn(),
          revokeAccessToken: jest.fn(),
          revokeIdToken: jest.fn(),
          revokeRefreshToken: jest.fn(),
          introspectAccessToken: jest.fn(),
          introspectIdToken: jest.fn(),
          introspectRefreshToken: jest.fn(),
          refreshTokens: jest.fn(),
        },
      },
    },
    ReactNative,
  );
});

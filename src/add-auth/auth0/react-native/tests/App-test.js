/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);

it('renders correctly', () => {
  const app = renderer.create(<App />);
  expect(app).not.toBe(null);
});

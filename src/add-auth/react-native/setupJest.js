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

const EventEmitter = require('EventEmitter');
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

class NativeEventEmitter extends EventEmitter {
  constructor() {
    super(RCTDeviceEventEmitter.sharedSubscriber);
  }
}

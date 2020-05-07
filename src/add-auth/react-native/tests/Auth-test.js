import React from 'react';
import Auth from '../Auth';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { waitForState } from 'enzyme-async-helpers';
import { NativeEventEmitter } from 'react-native';

const nativeEmitter = new NativeEventEmitter();

jest
  .mock(
    '../node_modules/react-native/Libraries/Components/StatusBar/StatusBar',
    () => 'StatusBar',
  )
  .mock(
    '../node_modules/react-native/Libraries/Components/ScrollView/ScrollView',
    () => 'ScrollView',
  )
  .mock(
    '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
  );

global.fetch = jest
  .fn()
  .mockImplementation(() => {
    return new Promise((resolve, reject) => {
      resolve({
        json: () => {
          return {
            user: [{ foo: 'foo', bar: 'bar' }],
          }
        },
        ok: true,
      });
    });
  })
  .mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve({
        json: () => {
          return {
            userinfo_endpoint: 'dummy_endpoint',
          }
        },
        ok: true,
      });
    });
  });

describe('auth setup', () => {
  it('should render without crashing', () => {
    const rendered = renderer.create(<Auth />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('should render correctly', () => {
    const rendered = renderer.create(<Auth />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should initialize with default state', () => {
    const wrapper = shallow(<Auth />);
    expect(wrapper.state().authenticated).toBe(false);
    expect(wrapper.state().context).toBe(null);
  });

  it('should render login button if not authenticated', () => {
    const wrapper = shallow(<Auth />);
    const loginButton = wrapper.find('Button').get(0);
    expect(loginButton.props.title).toBe('Login');
  });

  it('should render logout and get user info buttons if authenticated', () => {
    const wrapper = shallow(<Auth />);
    wrapper.setState({authenticated: true});
    const logoutButton = wrapper.find('Button').get(0);
    const getUserFromIdButton = wrapper.find('Button').get(1);
    const getUserButton = wrapper.find('Button').get(2);
    expect(logoutButton.props.title).toBe('Logout');
    expect(getUserFromIdButton.props.title).toBe('Get User From Id Token');
    expect(getUserButton.props.title).toBe('Get User From Request');
  });

  it('should not render login button if authenticated', () => {
    const wrapper = shallow(<Auth />);
    wrapper.setState({authenticated: true});
    const loginButton = wrapper.find('Button').get(0);
    expect(loginButton.props.title).not.toBe('Login');
  });

  it('should not render logout and get user info buttons if not authenticated', () => {
    const wrapper = shallow(<Auth />);
    const logoutButton = wrapper.find('Button').get(0);
    const getUserFromIdButton = wrapper.find('Button').get(1);
    const getUserButton = wrapper.find('Button').get(2);
    expect(logoutButton.props.title).not.toBe('Logout');
    expect(getUserFromIdButton).toBe(undefined);
    expect(getUserButton).toBe(undefined);
  });
});

describe('authentication flow', () => {
  it('should detect when the user has logged in', async () => {
    const wrapper = shallow(<Auth />);
    const loginButton = wrapper.find('Button').get(0);
    await loginButton.props.onPress();
    expect(loginButton.props.title).toBe('Login');
    nativeEmitter.emit('signInSuccess');
    expect(wrapper.state().authenticated).toBe(true);
    expect(wrapper.state().context).toBe('Logged in!');
  });

  it('should detect when the user has signed out', async () => {
    const wrapper = shallow(<Auth />);
    wrapper.setState({authenticated: true});
    const logoutButton = wrapper.find('Button').get(0);
    await logoutButton.props.onPress();
    expect(logoutButton.props.title).toBe('Logout');
    nativeEmitter.emit('signOutSuccess');
    expect(wrapper.state().authenticated).toBe(false);
    expect(wrapper.state().context).toBe('Logged out!');
  });

  it('should return user profile information from id token', async () => {
    const mockGetIdToken = require('react-native').NativeModules.OktaSdkBridge.getIdToken;
    mockGetIdToken.mockImplementationOnce(() => {
      // id_token returns { a: 'b' }
      return {'id_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoiYiJ9.jiMyrsmD8AoHWeQgmxZ5yq8z0lXS67_QGs52AzC8Ru8'};
    });
    const wrapper = shallow(<Auth />);
    wrapper.setState({authenticated: true});
    const profileButton = wrapper.find('Button').get(1);
    await profileButton.props.onPress();
    await waitForState(wrapper, state => state.context !== null);
    expect(profileButton.props.title).toBe('Get User From Id Token');
    expect(wrapper.state().context).toContain('"a": "b"');
  });

  it('should return user profile information from getUser method', async () => {
    const mockGetUser = require('react-native').NativeModules.OktaSdkBridge.getUser;
    mockGetUser.mockResolvedValue({ "name": "Mock User" });
    const wrapper = shallow(<Auth />);
    wrapper.setState({authenticated: true});
    const profileButton = wrapper.find('Button').get(2);
    await profileButton.props.onPress();
    await waitForState(wrapper, state => state.context !== null);
    expect(profileButton.props.title).toBe('Get User From Request');
  });
});

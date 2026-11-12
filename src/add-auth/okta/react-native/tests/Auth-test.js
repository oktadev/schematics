import React from 'react';
import { DeviceEventEmitter, NativeModules } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Auth from '../Auth';

const { OktaSdkBridge } = NativeModules;

// The Okta SDK's EventEmitter listens on the device event emitter
const emit = async event => {
  await act(async () => {
    DeviceEventEmitter.emit(event);
  });
};

const login = async () => {
  OktaSdkBridge.isAuthenticated.mockResolvedValue({ authenticated: true });
  await emit('signInSuccess');
};

beforeEach(() => {
  jest.clearAllMocks();
  OktaSdkBridge.isAuthenticated.mockResolvedValue({ authenticated: false });
});

describe('auth setup', () => {
  it('should render correctly', async () => {
    await render(<Auth />);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('should render login button if not authenticated', async () => {
    await render(<Auth />);
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.queryByText('Logout')).toBeNull();
    expect(screen.queryByText('Get User From Id Token')).toBeNull();
    expect(screen.queryByText('Get User From Request')).toBeNull();
  });

  it('should render logout and get user info buttons if authenticated', async () => {
    await render(<Auth />);
    await login();
    expect(screen.queryByText('Login')).toBeNull();
    expect(screen.getByText('Logout')).toBeTruthy();
    expect(screen.getByText('Get User From Id Token')).toBeTruthy();
    expect(screen.getByText('Get User From Request')).toBeTruthy();
  });
});

describe('authentication flow', () => {
  it('should sign in when the login button is pressed', async () => {
    await render(<Auth />);
    await fireEvent.press(screen.getByText('Login'));
    expect(OktaSdkBridge.signIn).toHaveBeenCalled();
  });

  it('should detect when the user has logged in', async () => {
    await render(<Auth />);
    await login();
    expect(screen.getByText('Logged in!')).toBeTruthy();
  });

  it('should detect when the user has signed out', async () => {
    await render(<Auth />);
    await login();
    await fireEvent.press(screen.getByText('Logout'));
    expect(OktaSdkBridge.signOut).toHaveBeenCalled();
    OktaSdkBridge.isAuthenticated.mockResolvedValue({ authenticated: false });
    await emit('signOutSuccess');
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Logged out!')).toBeTruthy();
  });

  it('should return user profile information from id token', async () => {
    // An unsigned test token whose payload is { a: 'b' }
    const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
    const idToken = [encode({ alg: 'none', typ: 'JWT' }), encode({ a: 'b' }), 'signature'].join('.');
    OktaSdkBridge.getIdToken.mockResolvedValue({ id_token: idToken });
    await render(<Auth />);
    await login();
    await fireEvent.press(screen.getByText('Get User From Id Token'));
    expect(await screen.findByText(/"a": "b"/)).toBeTruthy();
  });

  it('should return user profile information from getUser method', async () => {
    OktaSdkBridge.getUser.mockResolvedValue({ name: 'Mock User' });
    await render(<Auth />);
    await login();
    await fireEvent.press(screen.getByText('Get User From Request'));
    expect(await screen.findByText(/Mock User/)).toBeTruthy();
  });
});

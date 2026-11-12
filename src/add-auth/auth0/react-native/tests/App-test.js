/**
 * @format
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

it('renders correctly', async () => {
  await render(<App />);
  expect(screen.getByText('Step Zero')).toBeTruthy();
});

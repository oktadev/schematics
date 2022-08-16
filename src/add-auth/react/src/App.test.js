import React from 'react';

import { createRoot } from 'react-dom/client';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('renders learn react link', async () => {
  await act(async () => {
    const root = createRoot(container);
    root.render(<MemoryRouter><App /></MemoryRouter>);
  });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

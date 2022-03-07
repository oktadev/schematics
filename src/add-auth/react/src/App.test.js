import React from 'react';
import ReactDOM from 'react-dom';
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
    ReactDOM.render(<MemoryRouter><App /></MemoryRouter>, container);
  });

  const linkElement = container.querySelector('a');
  expect(linkElement.textContent).toBe('Learn React');
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileDetailScreen from '../pages/profileDetails/ProfileDetailScreen';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../redux/store';

// Mock the translation hook for all tests
import { vi } from 'vitest';
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Basic smoke test
it('renders without crashing', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ProfileDetailScreen />
      </BrowserRouter>
    </Provider>
  );
});

// Checks for loading text
it('shows loading text initially', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ProfileDetailScreen />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByText('loading')).toBeInTheDocument();
});

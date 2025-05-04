import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './test-i18n'
import { BrowserRouter } from 'react-router-dom';

export const I18nextWrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
);

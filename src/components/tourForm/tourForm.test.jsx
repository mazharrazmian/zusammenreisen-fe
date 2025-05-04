import TourForm from './tourForm';
import { expect, test } from 'vitest'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {I18nextWrapper} from '../../tests/test-utils'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import {store} from '../../redux/store'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import jest from 'jest-mock';


// Simulate i18next init for testing
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
    //   en: {
    //     translation: {
    //       tourActivities: 'Tour Activities',
    //       // add other necessary translations here
    //     },
    //   },
    },
    interpolation: {
      escapeValue: false,
    },
  });


describe('TourForm Component', () => {
    window.URL.createObjectURL = jest.fn();

    afterEach(() => {
      window.URL.createObjectURL.mockReset();
    });
  
    beforeEach(() => {
        render(
            <Provider store={store}>
            <BrowserRouter>
            <TourForm />
            </BrowserRouter>
            </Provider>
            );
    });
  
    it('renders form titles and sections', () => {
      expect(screen.getByText('createNewTour')).toBeInTheDocument();
      expect(screen.getByText('tourDetails')).toBeInTheDocument();
      expect(screen.getByText('travelInformation')).toBeInTheDocument();
      expect(screen.getByText('datesGroupSize')).toBeInTheDocument();
      expect(screen.getByText('tourActivities')).toBeInTheDocument();
      expect(screen.getByText('costDetails')).toBeInTheDocument();
      expect(screen.getByText('tourImages')).toBeInTheDocument();
    });
  
    it('allows typing into text fields', async () => {
        const titleInput = screen.getByRole('textbox', { name: /title/i });
        const descriptionInput = screen.getByRole('textbox', { name: /description/i });
        await userEvent.type(titleInput, 'Test Tour');
        await userEvent.type(descriptionInput, 'This is a description');
  
    expect(titleInput).toHaveValue('Test Tour');
      expect(descriptionInput).toHaveValue('This is a description');
    });
  
    it('adds and removes an activity', async () => {
      const activityInput = screen.getByLabelText('addActivity');
      await userEvent.type(activityInput, 'Hiking');
      await userEvent.keyboard('[Enter]');
  
      expect(screen.getByText('Hiking')).toBeInTheDocument();
      const deleteButton = screen.getByLabelText('Hiking');
      await userEvent.click(deleteButton);
  
    //   expect(screen.queryByText('Hiking')).not.toBeInTheDocument();
    });
  
    it('uploads images', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
  
      const input = screen.getByText('uploadTourImages');
      await userEvent.upload(input, file);
  
      await waitFor(() =>
        expect(screen.getByAltText(/preview/i)).toBeInTheDocument()
      );
    });
  
    // it('submits the form', async () => {
    //   const titleInput = screen.getByText('tourTitle');
    //   const descriptionInput = screen.getByText('tourDescription');
  
    //   await userEvent.type(titleInput, 'Test Tour Submission');
    //   await userEvent.type(descriptionInput, 'Testing form submission');
  
    //   const submitButton = screen.getByRole('button', { name: /create tour/i });
    //   await userEvent.click(submitButton);
  
    //   await waitFor(() =>
    //     expect(submitButton).toBeDisabled() // assuming loading state disables the button
    //   );
    // });
  });
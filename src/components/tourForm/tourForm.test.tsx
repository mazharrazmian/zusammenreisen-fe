import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import TourForm from './tourForm';
import postServices from '../../test/__mocks__/redux/api/postService';
import { toast } from 'react-toastify';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';



// API Service mock
jest.mock('../../test/__mocks__/redux/api/postService', () => {
  // Mock the API URL constants
  const API_URL = 'http://mock-api';
  const CHAT_URL = 'http://mock-chat';
  
  // Create mock axios instances
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  
  return {
    API_URL,
    CHAT_URL,
    callAPi: mockAxiosInstance,
    callAPiMultiPart: mockAxiosInstance,
    handleApiError: jest.fn(),
  };
});

// Mock localStorage for i18nextLng
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'en'),
    setItem: jest.fn(),
  },
  writable: true
});

// Mock Cookies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
}));

// Mock the existing modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn()
}));

jest.mock('../../test/__mocks__/redux/api/postService');
jest.mock('react-toastify');

// Mock the store data
jest.mock('../../redux/store', () => ({
  ...jest.requireActual('../../redux/store'),
  useAppSelector: () => ({
    countries: [
      { id: '1', name: 'Germany' },
      { id: '2', name: 'France' }
    ]
  })
}));

// Mock translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key : any) => key,
    i18n: { language: 'en' }
  })
}));

// Mock environment variables
jest.mock('@/env', () => ({
  VITE_API_URL: 'http://mock-api',
  VITE_CHAT_URL: 'http://mock-chat',
}), { virtual: true });

describe('TourForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL object creation
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  describe('Create Tour Mode', () => {
    beforeEach(() => {
      // Mock useParams to return empty object for create mode
      (useParams as jest.Mock).mockReturnValue({});
    });

    test('renders the create tour form correctly', () => {
      renderWithProviders({ children: <TourForm /> });
      
      expect(screen.getByText('createNewTour')).toBeInTheDocument();
      expect(screen.getByLabelText('tourTitle')).toBeInTheDocument();
      expect(screen.getByLabelText('tourDescription')).toBeInTheDocument();
    });

    test('validates form fields on submission', async () => {
      renderWithProviders({ children: <TourForm /> });
      
      // Try to submit without filling required fields
      const submitButton = screen.getByText('createTour');
      fireEvent.click(submitButton);
      
      // Check for validation messages
      await waitFor(() => {
        expect(screen.getByText('titleRequired')).toBeInTheDocument();
        expect(screen.getByText('descriptionRequired')).toBeInTheDocument();
      });
    });

    test('submits the form successfully with valid data', async () => {
      // Mock the API response
      (postServices.createPost as jest.Mock).mockResolvedValue({ status: 201 });
      
      renderWithProviders({ children: <TourForm /> });
      
      // Fill in required fields
      await userEvent.type(screen.getByLabelText('tourTitle'), 'Test Tour');
      await userEvent.type(screen.getByLabelText('tourDescription'), 'Tour description');
      
      // Select country and city
      const fromCountryInput = screen.getByLabelText('fromCountry');
      fireEvent.change(fromCountryInput, { target: { value: 'Germany' } });
      
      // Add an activity
      const activityInput = screen.getByLabelText('addActivity');
      await userEvent.type(activityInput, 'Hiking');
      fireEvent.click(screen.getByTestId('AddIcon'));
      
      // Mock file upload
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText('uploadTourImages');
      await userEvent.upload(fileInput, file);
      
      // Submit the form
      const submitButton = screen.getByText('createTour');
      fireEvent.click(submitButton);
      
      // Verify form submission
      await waitFor(() => {
        expect(postServices.createPost).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('tourCreatedSuccessfully');
      });
    });
  });

  describe('Edit Tour Mode', () => {
    const mockTourData = {
      title: 'Existing Tour',
      description: 'Tour description',
      travel_from_country: { id: '1', name: 'Germany' },
      travel_from_city: { id: '1', name: 'Berlin' },
      travel_to_country: { id: '2', name: 'France' },
      travel_to_city: { id: '2', name: 'Paris' },
      date_from: '2025-05-01',
      date_to: '2025-05-10',
      dates_flexible: true,
      group_size: 5,
      current_travellers: 2,
      tour_type: 'adventure',
      activities: ['Hiking', 'Swimming'],
      accommodation_type: 'hotel',
      estimated_cost: 1000,
      age_group: 'any',
      cost_includes: 'Food and lodging',
      requirements: 'Good health',
      itinerary: 'Day 1: Arrival',
      images: ['https://example.com/image1.jpg']
    };

    beforeEach(() => {
      // Mock useParams to return tourId for edit mode
      (useParams as jest.Mock).mockReturnValue({ tourId: '123' });
      
      // Mock fetch for images
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob(['test'], { type: 'image/jpeg' }))
      });
      
      // Mock the API response for getting tour details
      (postServices.getPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockTourData
      });
    });

    test('loads and displays existing tour data', async () => {
      renderWithProviders({ children: <TourForm /> });
      
      await waitFor(() => {
        expect(postServices.getPost).toHaveBeenCalledWith('123');
        expect(screen.getByDisplayValue('Existing Tour')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Tour description')).toBeInTheDocument();
      });
    });

    test('updates tour successfully', async () => {
      // Mock the API response
      (postServices.editPost as jest.Mock).mockResolvedValue({ status: 200 });
      
      renderWithProviders({ children: <TourForm /> });
      
      // Wait for form to load with existing data
      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Tour')).toBeInTheDocument();
      });
      
      // Update title
      const titleInput = screen.getByDisplayValue('Existing Tour');
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, 'Updated Tour Title');
      
      // Submit the form
      const submitButton = screen.getByText('submitChanges');
      fireEvent.click(submitButton);
      
      // Verify form submission
      await waitFor(() => {
        expect(postServices.editPost).toHaveBeenCalledWith(123, expect.any(FormData));
        expect(toast.success).toHaveBeenCalledWith('tourEditedSuccessfully');
      });
    });

    test('handles API errors during tour editing', async () => {
      // Mock API error
      (postServices.editPost as jest.Mock).mockRejectedValue({
        response: {
          data: {
            errors: [{ detail: 'Error message', attr: 'title' }]
          }
        }
      });
      
      renderWithProviders({ children: <TourForm /> });
      
      // Wait for form to load with existing data
      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Tour')).toBeInTheDocument();
      });
      
      // Submit the form
      const submitButton = screen.getByText('submitChanges');
      fireEvent.click(submitButton);
      
      // Verify error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error message (title)');
      });
    });

    test('adds and removes activities correctly', async () => {
      renderWithProviders({ children: <TourForm /> });
      
      // Wait for form to load with existing data
      await waitFor(() => {
        expect(screen.getByText('Hiking')).toBeInTheDocument();
        expect(screen.getByText('Swimming')).toBeInTheDocument();
      });
      
      // Add a new activity
      const activityInput = screen.getByLabelText('addActivity');
      await userEvent.type(activityInput, 'Skiing');
      fireEvent.click(screen.getByTestId('AddIcon'));
      
      // Check that the new activity is added
      expect(screen.getByText('Skiing')).toBeInTheDocument();
      
      // Remove an activity
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      fireEvent.click(deleteButtons[0]); // Remove "Hiking"
      
      // Check that the activity was removed
      await waitFor(() => {
        expect(screen.queryByText('Hiking')).not.toBeInTheDocument();
        expect(screen.getByText('Swimming')).toBeInTheDocument();
        expect(screen.getByText('Skiing')).toBeInTheDocument();
      });
    });
  });

  test('handles image uploads and removals', async () => {
    (useParams as jest.Mock).mockReturnValue({});
    
    renderWithProviders({ children: <TourForm /> });
    
    // Mock file upload
    const file1 = new File(['dummy content'], 'test1.png', { type: 'image/png' });
    const file2 = new File(['dummy content'], 'test2.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('uploadTourImages');
    
    // Upload first image
    await userEvent.upload(fileInput, file1);
    
    // Check that the image preview is shown
    expect(screen.getByAltText('preview-0')).toBeInTheDocument();
    
    // Upload second image
    await userEvent.upload(fileInput, file2);
    
    // Check that both image previews are shown
    expect(screen.getAllByAltText(/preview-/)).toHaveLength(2);
    
    // Remove first image
    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    fireEvent.click(deleteButtons[0]);
    
    // Check that only one image remains
    await waitFor(() => {
      expect(screen.getAllByAltText(/preview-/)).toHaveLength(1);
    });
  });
});
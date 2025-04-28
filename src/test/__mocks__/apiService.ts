// __mocks__/apiService.ts
import { vi } from 'vitest'; // If using Vitest, use jest if you're using Jest

// Mock environment variables
vi.mock('@/env', () => ({
  VITE_API_URL: 'http://mock-api',
  VITE_CHAT_URL: 'http://mock-chat',
}));

// Mock Cookies
const mockCookies = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};
vi.mock('js-cookie', () => ({
  default: mockCookies,
}));

// Mock toast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
};
vi.mock('react-toastify', () => ({
  toast: mockToast,
}));

// Mock axios responses
const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

// Mock axios constructor
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    isAxiosError: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock localStorage
vi.mock('window.localStorage', () => ({
  getItem: vi.fn(() => 'en'),
}), { virtual: true });

// Export mocked API
export const API_URL = 'http://mock-api';
export const CHAT_URL = 'http://mock-chat';
export const callAPi = mockAxiosInstance;
export const callAPiMultiPart = mockAxiosInstance;
export const handleApiError = vi.fn();

// Export mocks for testing
export const mocks = {
  cookies: mockCookies,
  toast: mockToast,
  axios: mockAxiosInstance,
};
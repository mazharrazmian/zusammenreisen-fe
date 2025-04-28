process.env.VITE_API_URL = 'http://mock-api';
process.env.VITE_CHAT_URL = 'http://mock-chat';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'en'),
    setItem: jest.fn(),
  },
  writable: true
});
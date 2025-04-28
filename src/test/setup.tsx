import '@testing-library/jest-dom';
import { server } from './server';

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:8000/api';
process.env.VITE_CHAT_URL = 'ws://localhost:8001';


// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset any runtime request handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());

// __mocks__/../../redux/api/postService.js
import { callAPi, callAPiMultiPart } from '../../services/apiService';

const postServices = {
  createPost: jest.fn(async (formData) => {
    // Here we can use the mocked callAPiMultiPart
    return { status: 201, data: { id: '123', ...formData } };
  }),
  
  getPost: jest.fn(async (id) => {
    // Here we can use the mocked callAPi
    return { status: 200, data: {} };  // The actual data is set in specific tests
  }),
  
  editPost: jest.fn(async (id, formData) => {
    // Here we can use the mocked callAPiMultiPart
    return { status: 200, data: { id, ...formData } };
  }),
  
  deletePost: jest.fn(async (id) => {
    // Here we can use the mocked callAPi
    return { status: 204 };
  }),
  
  // Add any other methods your service uses
};

export default postServices;
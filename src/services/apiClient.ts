import { ApiResponse } from '../types';

const DEFAULT_DELAY = 300;

/**
 * A mock API client to simulate real backend interactions.
 * This makes it easier to swap with a real HTTP client (like axios or fetch) later.
 */
export const apiClient = {
  /**
   * Simulate a GET request
   */
  get: async <T>(data: T, delay = DEFAULT_DELAY): Promise<ApiResponse<T>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 200,
          success: true,
        });
      }, delay);
    });
  },

  /**
   * Simulate a POST request
   */
  post: async <T>(data: T, delay = DEFAULT_DELAY): Promise<ApiResponse<T>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 201,
          success: true,
        });
      }, delay);
    });
  },

  /**
   * Simulate a PUT request
   */
  put: async <T>(data: T, delay = DEFAULT_DELAY): Promise<ApiResponse<T>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 200,
          success: true,
        });
      }, delay);
    });
  },

  /**
   * Simulate a DELETE request
   */
  delete: async <T>(data: T, delay = DEFAULT_DELAY): Promise<ApiResponse<T>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          status: 200,
          success: true,
        });
      }, delay);
    });
  },

  /**
   * Simulate an error response
   */
  error: async (message: string, status = 400, delay = DEFAULT_DELAY): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: null,
          message,
          status,
          success: false,
        });
      }, delay);
    });
  }
};

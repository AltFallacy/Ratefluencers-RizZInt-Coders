import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token when available
apiClient.interceptors.request.use(
  (config) => {
    // TODO: attach Bearer token when auth is implemented
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // TODO: handle 401 / 403 / 500 globally
    return Promise.reject(error);
  }
);

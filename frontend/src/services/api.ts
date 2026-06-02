import axios from 'axios';

// With the Next.js proxy rewrite, /api/v1 on the same origin proxies to FastAPI.
// This means CORS is never an issue and we don't need NEXT_PUBLIC_API_URL in the browser.
export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15_000,
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
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        console.warn('[API] 404 Not Found:', error.config?.url);
      } else if (status && status >= 500) {
        console.error('[API] Server error:', status, error.config?.url);
      } else if (!error.response) {
        // Network error / backend offline
        console.warn('[API] Backend offline or unreachable — falling back to demo data');
      }
    }
    return Promise.reject(error);
  }
);

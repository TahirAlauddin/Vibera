/**
 * Enhanced API fetch utility with JWT token injection and automatic refresh
 */

import { getAccessToken, isTokenExpired } from './auth';
import { refreshToken } from './auth-api';

// Get API base URL from environment variable, default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Options for apiFetch
 */
interface ApiFetchOptions extends RequestInit {
  /**
   * Whether authentication is required for this request
   * If true, automatically injects Bearer token and handles refresh on 401
   */
  requireAuth?: boolean;
}

/**
 * Enhanced fetch function with automatic token injection and refresh
 * @param path API endpoint path (relative to API_BASE_URL)
 * @param options Fetch options including requireAuth flag
 * @returns Promise that resolves to the response data
 * @throws Error if request fails or authentication is required but unavailable
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { requireAuth = false, headers = {}, ...fetchOptions } = options;

  // Build full URL - if path starts with http, use it as-is, otherwise prepend API_BASE_URL
  const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  // Prepare headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Inject Bearer token if authentication is required
  if (requireAuth) {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('Authentication required. Please login.');
    }

    // Check if token is expired (optional check, backend will validate anyway)
    if (isTokenExpired(accessToken)) {
      // Try to refresh the token before making the request
      try {
        const newAccessToken = await refreshToken();
        requestHeaders['Authorization'] = `Bearer ${newAccessToken}`;
      } catch (error) {
        throw new Error('Session expired. Please login again.');
      }
    } else {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  // Make the initial request
  let res = await fetch(fullUrl, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  // Handle 401 Unauthorized - attempt token refresh and retry
  if (res.status === 401 && requireAuth) {
    try {
      // Attempt to refresh the token
      const newAccessToken = await refreshToken();
      
      // Retry the original request with the new token
      const retryHeaders: HeadersInit = {
        ...requestHeaders,
        'Authorization': `Bearer ${newAccessToken}`,
      };

      res = await fetch(fullUrl, {
        ...fetchOptions,
        headers: retryHeaders,
      });

      // If retry still fails with 401, authentication is invalid
      if (res.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
    } catch (refreshError) {
      // If refresh fails, throw an error
      if (refreshError instanceof Error) {
        throw refreshError;
      }
      throw new Error('Session expired. Please login again.');
    }
  }

  // Handle non-OK responses
  if (!res.ok) {
    // Try to extract error message from response
    let errorMessage = `API failed with status ${res.status}`;
    
    try {
      const errorData = await res.json();
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      }
    } catch {
      // If response is not JSON, use default error message
    }

    throw new Error(errorMessage);
  }

  // Return parsed JSON response
  return res.json() as Promise<T>;
}

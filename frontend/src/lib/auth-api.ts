/**
 * Authentication API functions for JWT-based authentication
 * Integrates with Django backend using Djoser and SimpleJWT
 */

import { setTokens, clearTokens, getAccessToken, getRefreshToken } from './auth';

// Get API base URL from environment variable, default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Response type for JWT token creation (login)
 */
interface LoginResponse {
  access: string;
  refresh: string;
}

/**
 * Response type for token refresh
 */
interface RefreshResponse {
  access: string;
}

/**
 * User type from backend
 */
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  date_joined: string;
}

/**
 * Error response type from backend
 */
interface ErrorResponse {
  [key: string]: string | string[];
}

/**
 * Login with username and password
 * @param username User's username
 * @param password User's password
 * @returns Promise that resolves to the login response with tokens
 * @throws Error if login fails
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/jwt/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}));
      const errorMessage = 
        typeof errorData.detail === 'string' 
          ? errorData.detail 
          : typeof errorData.non_field_errors === 'object' && Array.isArray(errorData.non_field_errors)
          ? errorData.non_field_errors[0]
          : 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    
    // Store tokens in localStorage
    setTokens(data.access, data.refresh);
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during login');
  }
}

/**
 * Sign up a new user
 * @param email User's email address
 * @param username User's username
 * @param password User's password
 * @param passwordRetype Password confirmation
 * @returns Promise that resolves to the created user data
 * @throws Error if signup fails
 */
export async function signup(
  email: string,
  username: string,
  password: string,
  passwordRetype: string
): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        password,
        re_password: passwordRetype,
      }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}));
      
      // Extract error messages from backend response
      const errorMessages: string[] = [];
      for (const [key, value] of Object.entries(errorData)) {
        if (Array.isArray(value)) {
          errorMessages.push(...value);
        } else if (typeof value === 'string') {
          errorMessages.push(value);
        }
      }
      
      const errorMessage = errorMessages.length > 0 
        ? errorMessages.join('. ')
        : 'Signup failed. Please check your information.';
      throw new Error(errorMessage);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during signup');
  }
}

/**
 * Refresh the access token using the refresh token
 * @param refreshToken Optional refresh token. If not provided, retrieves from localStorage
 * @returns Promise that resolves to the new access token
 * @throws Error if refresh fails
 */
export async function refreshToken(refreshToken?: string): Promise<string> {
  const token = refreshToken || getRefreshToken();
  
  if (!token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/jwt/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: token }),
    });

    if (!response.ok) {
      // If refresh fails, clear tokens
      clearTokens();
      const errorData: ErrorResponse = await response.json().catch(() => ({}));
      const errorMessage = 
        typeof errorData.detail === 'string' 
          ? errorData.detail 
          : 'Token refresh failed. Please login again.';
      throw new Error(errorMessage);
    }

    const data: RefreshResponse = await response.json();
    
    // Update access token in localStorage
    const currentRefreshToken = getRefreshToken();
    if (currentRefreshToken) {
      setTokens(data.access, currentRefreshToken);
    }
    
    return data.access;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during token refresh');
  }
}

/**
 * Get the current authenticated user's information
 * @returns Promise that resolves to the current user data
 * @throws Error if request fails or user is not authenticated
 */
export async function getCurrentUser(): Promise<User> {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available. Please login.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/users/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try to refresh
        try {
          const newAccessToken = await refreshToken();
          // Retry the request with new token
          const retryResponse = await fetch(`${API_BASE_URL}/api/auth/users/me/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newAccessToken}`,
            },
          });

          if (!retryResponse.ok) {
            clearTokens();
            throw new Error('Authentication failed. Please login again.');
          }

          return await retryResponse.json();
        } catch (refreshError) {
          clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }

      const errorData: ErrorResponse = await response.json().catch(() => ({}));
      const errorMessage = 
        typeof errorData.detail === 'string' 
          ? errorData.detail 
          : 'Failed to fetch user information.';
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching user information');
  }
}

/**
 * Logout the current user by clearing tokens from localStorage
 */
export function logout(): void {
  clearTokens();
}

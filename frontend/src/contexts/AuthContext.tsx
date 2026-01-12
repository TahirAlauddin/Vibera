'use client';

/**
 * Authentication Context for JWT-based authentication
 * Provides auth state and functions throughout the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAccessToken, getRefreshToken, isTokenExpired, clearTokens } from '../lib/auth';
import { login as apiLogin, signup as apiSignup, getCurrentUser, logout as apiLogout, refreshToken, User } from '../lib/auth-api';

/**
 * Auth context state interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, passwordRetype: string) => Promise<void>;
  logout: () => void;
}

/**
 * Create the auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that manages authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Initialize auth state from localStorage and validate tokens
   */
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      // If no tokens, user is not authenticated
      if (!accessToken || !refreshToken) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check if access token is expired
      if (isTokenExpired(accessToken)) {
        // If refresh token is also expired, clear everything
        if (isTokenExpired(refreshToken)) {
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Try to refresh the access token
        try {
          await refreshToken();
          // Token refreshed successfully, continue to fetch user
        } catch (error) {
          // Refresh failed, clear tokens and logout
          clearTokens();
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
      }

      // Fetch current user data
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Failed to fetch user, clear tokens
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Error during initialization, clear state
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Login function
   */
  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiLogin(username, password);
      
      // Tokens are already stored by apiLogin
      // Fetch user data
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      // Clear any partial state
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Signup function
   */
  const signup = useCallback(async (
    email: string,
    username: string,
    password: string,
    passwordRetype: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Create the user account
      const newUser = await apiSignup(email, username, password, passwordRetype);
      
      // Auto-login after successful signup
      // The backend should return tokens or we need to login separately
      // For now, we'll attempt to login with the new credentials
      try {
        const response = await apiLogin(username, password);
        // Tokens are stored by apiLogin
        setUser(newUser);
        setIsAuthenticated(true);
      } catch (loginError) {
        // If auto-login fails, user can manually login
        // Still consider signup successful
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        throw new Error('Account created successfully, but automatic login failed. Please login manually.');
      }
    } catch (error) {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use the auth context
 * @returns AuthContextType
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // You might have a `/api/me` endpoint to get user data from a token
          const userData = await apiService.getMe(); 
          setUser(userData);
        } catch (e) {
          console.error("Token validation failed", e);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, [token]);

  const login = async (username: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { token: newToken, user: newUser } = await apiService.login(username, pass);
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (e: any) {
        setError(e.message || 'An error occurred during login.');
        setIsLoading(false);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, user, token, isLoading, error, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
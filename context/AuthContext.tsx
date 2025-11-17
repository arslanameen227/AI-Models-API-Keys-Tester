import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: false,
  error: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isLoggedIn');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    return new Promise(resolve => {
        setTimeout(() => {
            // Mock authentication
            if (user === 'admin' && pass === 'password') {
                localStorage.setItem('isLoggedIn', 'true');
                setIsLoggedIn(true);
                setIsLoading(false);
                resolve(true);
            } else {
                setError('Invalid username or password.');
                setIsLoading(false);
                resolve(false);
            }
        }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
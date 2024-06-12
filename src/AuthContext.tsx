import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

export interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminCredentials: {
    username: string;
    password: string;
    token: string;
  };
  setAdminCredentials: React.Dispatch<React.SetStateAction<{ username: string; password: string; token: string }>>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentials] = useState<{ username: string; password: string; token: string }>({
    username: '',
    password: '',
    token: '',
  });

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:4001/auth/token', {
        token: localStorage.getItem('refreshToken'),
      });
      setAdminCredentials((prevState) => ({
        ...prevState,
        token: response.data.accessToken,
      }));
      localStorage.setItem('authToken', response.data.accessToken);
    } catch (error) {
      console.error('Error refreshing token', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000); // Refresh token every 15 minutes
    return () => clearInterval(interval);
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, adminCredentials, setAdminCredentials, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

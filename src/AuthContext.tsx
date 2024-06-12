import React, { createContext, useState, ReactNode, useContext } from 'react';

export interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  adminCredentials: {
    username: string;
    password: string;
    token: string;
  };
  setAdminCredentials: React.Dispatch<React.SetStateAction<{ username: string; password: string; token: string }>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '', token: '' });

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, adminCredentials, setAdminCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

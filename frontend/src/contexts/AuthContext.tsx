import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  type: string;
  role?: string; // Add role property
  isAdmin?: boolean; // Add isAdmin property
  phone?: string;
  address?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateProfile: (userData: User) => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add isAdmin to context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      // Always start with a clean state - require login every time
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setToken(null);
      setUser(null);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser({
      ...userData,
      role: userData.type,
      isAdmin: userData.type === 'admin'
    });
    setToken(token);
    localStorage.setItem('currentUser', JSON.stringify({
      ...userData,
      role: userData.type,
      isAdmin: userData.type === 'admin'
    }));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateProfile = (userData: User) => {
    const updatedUser = {
      ...userData,
      role: userData.type,
      isAdmin: userData.type === 'admin'
    };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = !!user && user.isAdmin === true; // Check if user is admin

  const value = {
    user,
    token,
    login,
    logout,
    updateProfile,
    loading,
    isAuthenticated,
    isAdmin // Expose isAdmin in context
  };

  return (
    <AuthContext.Provider value={value}>
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
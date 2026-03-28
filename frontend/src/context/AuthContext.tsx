import React, { createContext, useContext, useState, useCallback } from 'react';
import { demoUser, UserProfile } from '@/data/demoUser';

import { api } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.success) {
        setUser({ ...demoUser, ...res.data, fullName: res.data.name, email: res.data.email });
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.error("Failed to load user", e);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        await loadUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [loadUser]);

  const signup = useCallback(async (fullName: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/signup', { name: fullName, email, password });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        await loadUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [loadUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

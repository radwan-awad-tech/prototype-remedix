import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../../types';

import { demoIdentity, setSessionActor } from './session';
import { ROLE_ORDER } from './permissions';
import { DEMO_EMAIL, isDemoCredentialMatch } from './demoCredentials';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('current_user');

      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && ROLE_ORDER.includes(parsedUser.role) && typeof parsedUser.name === 'string') {
          const restored = demoIdentity(parsedUser.name, parsedUser.role);
          setSessionActor(restored);
          setToken(savedToken);
          setUser(restored);
        } else {
          // Corrupted session
          localStorage.removeItem('auth_token');
          localStorage.removeItem('current_user');
        }
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, password: string, role: string) => {
    if (!isDemoCredentialMatch(email, password)) {
      throw new Error('Invalid demo credentials.');
    }

    const mockUser = demoIdentity('Radwan', role as RoleType);
    mockUser.email = DEMO_EMAIL;
    setSessionActor(mockUser);
    const mockToken = 'mock-jwt-token-' + Date.now();

    setToken(mockToken);
    setUser(mockUser);

    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('current_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setSessionActor(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!token,
      isLoading 
    }}>
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

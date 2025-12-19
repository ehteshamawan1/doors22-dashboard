/**
 * useAuth Hook
 * Handle authentication state
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    const userEmail = localStorage.getItem('user_email');

    if (token && userEmail) {
      setIsAuthenticated(true);
      setUser({ email: userEmail });
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple hardcoded authentication
    // In production, this would call the backend API
    const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'leobel8@yahoo.com';
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Dr3tech!!';

    if (email === validEmail && password === validPassword) {
      const token = btoa(`${email}:${password}`); // Simple token
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_email', email);

      setIsAuthenticated(true);
      setUser({ email });

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

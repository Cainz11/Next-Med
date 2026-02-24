import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthResult } from './api';

interface AuthState {
  userId: string | null;
  email: string | null;
  role: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState & {
  login: (r: AuthResult) => void;
  logout: () => void;
  setAuth: (r: AuthResult) => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const t = localStorage.getItem('accessToken');
    const u = localStorage.getItem('userId');
    const e = localStorage.getItem('email');
    const r = localStorage.getItem('role');
    const n = localStorage.getItem('fullName');
    return {
      userId: u,
      email: e,
      role: r,
      fullName: n,
      isAuthenticated: !!(t && u),
    };
  });

  const login = useCallback((r: AuthResult) => {
    localStorage.setItem('accessToken', r.accessToken);
    localStorage.setItem('refreshToken', r.refreshToken);
    localStorage.setItem('userId', r.userId);
    localStorage.setItem('email', r.email);
    localStorage.setItem('role', r.role);
    localStorage.setItem('fullName', r.fullName ?? '');
    setState({ userId: r.userId, email: r.email, role: r.role, fullName: r.fullName ?? null, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    setState({ userId: null, email: null, role: null, fullName: null, isAuthenticated: false });
  }, []);

  const setAuth = useCallback((r: AuthResult) => login(r), [login]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

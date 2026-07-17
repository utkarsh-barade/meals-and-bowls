import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'mb_token';
const USER_KEY  = 'mb_user';

/**
 * AuthProvider — stores JWT and user in localStorage.
 * login() and logout() are stable references (useCallback).
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]   = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((authResponse) => {
    const { token: t, role, name, mobile } = authResponse;
    const userData = { role, name, mobile };
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(t);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === TOKEN_KEY && !e.newValue) logout();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [logout]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: !!token, login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

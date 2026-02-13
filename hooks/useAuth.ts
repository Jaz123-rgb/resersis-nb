import { useState, useEffect } from 'react';

interface DecodedToken {
  role: string;
  userId: number;
  sub: string;
  iat: number;
  exp: number;
}

export function useAuth(requiredRole?: string) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      console.error('Error decodificando token:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadAuth = () => {
      const storedToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      let authData = null;
      try {
        const authDataStr = localStorage.getItem('authData');
        if (authDataStr) {
          authData = JSON.parse(authDataStr);
        }
      } catch (err) {
        console.error('Error parsing auth data:', err);
      }

      const finalToken = storedToken || authData?.accessToken;

      if (!finalToken) {
        setError('No token found');
        setLoading(false);
        return;
      }

      const decoded = decodeToken(finalToken);
      if (!decoded || !decoded.role) {
        setError('Invalid token');
        setLoading(false);
        return;
      }

      setToken(finalToken);
      setUser(decoded);
      setIsAuthenticated(true);

      if (requiredRole && decoded.role !== requiredRole) {
        setError(`Unauthorized: Required role ${requiredRole}, but user has ${decoded.role}`);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    loadAuth();
  }, [requiredRole]);

  return { token, user, loading, error, isAuthenticated };
}
import { useState } from 'react';
import { LoginRequest, LoginResponse } from '../app/api/interface/LoginInterface';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (loginData: LoginRequest): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Usar la API route local en lugar de la externa
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        return data;
      } else {
        throw new Error(data.message || 'Error en el login');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};

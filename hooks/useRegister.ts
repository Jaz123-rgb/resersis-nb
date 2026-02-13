import { useState } from 'react';
import { RegisterRequest, RegisterResponse } from '../app/api/interface/RegisterInterface';
import registerUser from '../app/api/services/registerService';
import { useErrorHandler } from '../lib/hooks/useErrorHandler';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<RegisterResponse | null>(null);
  const { error, setError, clearError } = useErrorHandler();

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setSuccess(false);
    clearError();

    try {
      const response = await registerUser(userData);
      setRegisteredUser(response);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setRegisteredUser(null);
    clearError();
  };

  return {
    register,
    loading,
    error,
    success,
    registeredUser,
    reset,
    isError: !!error
  };
}

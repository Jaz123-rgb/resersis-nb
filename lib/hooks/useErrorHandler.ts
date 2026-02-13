import { useState, useCallback } from 'react';

interface ErrorState {
  error: string | null;
  isError: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false
  });

  const setError = useCallback((error: string | Error | null) => {
    if (error === null) {
      setErrorState({ error: null, isError: false });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : error;
    setErrorState({ error: errorMessage, isError: true });
    
    // Log del error para debugging
    console.error('Error capturado:', errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null, isError: false });
  }, []);

  return {
    ...errorState,
    setError,
    clearError
  };
}

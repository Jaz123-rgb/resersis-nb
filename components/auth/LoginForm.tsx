'use client';

import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { LoginRequest } from '../../app/api/interface/LoginInterface';

interface LoginFormProps {
  onSuccess?: (userData: any) => void;
  onCancel?: () => void;
}

export default function LoginForm({ onSuccess, onCancel }: LoginFormProps) {
  const { login, loading, error, success } = useLogin();
  const [formData, setFormData] = useState<LoginRequest>({
    email: 'pjaziel723@gmail.com',
    password: 'HBZ427IxFfXdmQl'
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const result = await login(formData);
    if (result && onSuccess) {
      onSuccess(result.data);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Has iniciado sesión correctamente.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.email 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="correo@ejemplo.com"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.password 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ingresa tu contraseña"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}

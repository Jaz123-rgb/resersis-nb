'use client';

import React, { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { validateRegisterForm } from '../../lib/utils/validationUtils';
import { RegisterRequest } from '../../app/api/interface/RegisterInterface';

interface RegisterFormProps {
  onSuccess?: (userData: any) => void;
  onCancel?: () => void;
}

export default function RegisterForm({ onSuccess, onCancel }: RegisterFormProps) {
  const { register, loading, error, success } = useRegister();
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    jobOccupation: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Realizar registro
    const success = await register(formData);
    if (success && onSuccess) {
      onSuccess(formData);
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
            ¡Registro exitoso!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.
          </p>
          <button
            onClick={onCancel}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Crear cuenta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.firstName 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ingresa tu nombre"
          />
          {validationErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Apellido *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.lastName 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ingresa tu apellido"
          />
          {validationErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
          )}
        </div>

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
            placeholder="Mínimo 6 caracteres"
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobOccupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ocupación *
          </label>
          <input
            type="text"
            id="jobOccupation"
            name="jobOccupation"
            value={formData.jobOccupation}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              validationErrors.jobOccupation 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ej: Marketing Manager"
          />
          {validationErrors.jobOccupation && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.jobOccupation}</p>
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
            {loading ? 'Registrando...' : 'Crear cuenta'}
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

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Los campos marcados con * son obligatorios
        </p>
      </div>
    </div>
  );
}

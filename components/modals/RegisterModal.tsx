'use client';

import React from 'react';
import RegisterForm from '../auth/RegisterForm';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userData: any) => void;
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  if (!isOpen) return null;

  const handleSuccess = (userData: any) => {
    if (onSuccess) {
      onSuccess(userData);
    }
    // Cerrar modal después de 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <RegisterForm 
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

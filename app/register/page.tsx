'use client';

import { useRouter } from 'next/navigation';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = (userData: any) => {
    console.log('Usuario registrado:', userData);
    
    // Redirigir al login después del registro exitoso
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm 
        onSuccess={handleRegisterSuccess}
        onCancel={handleCancel}
      />
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}

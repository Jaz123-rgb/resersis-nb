'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (userData: any) => {
    console.log('Usuario logueado:', userData);
    
    // Redirigir al dashboard después del login exitoso
    setTimeout(() => {
      router.push('/calendar-auth'); // o la ruta principal de tu app
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/'); // redirigir a home o página principal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        onSuccess={handleLoginSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarAuth from '@/components/CalendarAuth';

export default function CalendarAuthPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar diferentes formas de almacenar el token
    const storedToken = localStorage.getItem('authToken') || 
                       localStorage.getItem('accessToken');
    
    // También verificar si hay un objeto completo de auth
    let authData = null;
    try {
      const authDataStr = localStorage.getItem('authData');
      if (authDataStr) {
        authData = JSON.parse(authDataStr);
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }

    // Obtener el token de donde esté disponible
    const finalToken = storedToken || authData?.accessToken;
    
    if (!finalToken) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('Token found:', finalToken.substring(0, 50) + '...');
    setToken(finalToken);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">No autorizado. Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <CalendarAuth token={token} />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarAuth from '@/components/calendar-auth/CalendarAuth';

export default function CalendarAuthPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isDay, setIsDay] = useState(true); // Estado para determinar si es día

  useEffect(() => {
    // Determinar si es día o noche basado en la hora actual
    const now = new Date();
    const hour = now.getHours();
    setIsDay(hour >= 6 && hour < 18); // Día de 6 AM a 6 PM

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
      <div className={`min-h-screen ${isDay ? 'bg-white' : 'bg-black'} flex justify-center items-center`}>
        <div className={`text-lg ${isDay ? 'text-black' : 'text-white'}`}>Verificando autenticación...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={`min-h-screen ${isDay ? 'bg-white' : 'bg-black'} flex justify-center items-center`}>
        <div className="text-red-500 text-lg">No autorizado. Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDay ? 'bg-white' : 'bg-black'}`}>
      <CalendarAuth token={token} />
    </div>
  );
}

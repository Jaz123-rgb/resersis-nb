'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarAuth from '@/components/calendar-auth/CalendarAuth';
import { useAuth } from '@/hooks/useAuth';

export default function CalendarAuthPage() {
  const { token, loading, error, isAuthenticated } = useAuth('ADMIN');
  const router = useRouter();
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login'); // O '/unauthorized'
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDay ? 'bg-white' : 'bg-black'} flex justify-center items-center`}>
        <div className={`text-lg ${isDay ? 'text-black' : 'text-white'}`}>Verificando autenticación...</div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDay ? 'bg-white' : 'bg-black'} flex justify-center items-center`}>
        <div className="text-red-500 text-lg">{error || 'No autorizado'}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDay ? 'bg-white' : 'bg-black'}`}>
      <CalendarAuth token={token!} />
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedAppointments } from '@/lib/appointmentsAuthService';
import CalendarHeader from './CalendarHeader';
import MonthNavigation from './MonthNavigation';
import CalendarGrid from './CalendarGrid';
import AppointmentList from './AppointmentList';
import Legend from './Legend';
import AppointmentModal from './AppointmentModal';

interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: string;
  guestName: string;
  guestEmail: string;
  active: boolean;
  confirmed: boolean;
  pending: boolean;
  createdAt?: string;
  updatedAt?: string;
  managementToken?: string;
}

interface CalendarAuthProps {
  token: string;
}

export default function CalendarAuth({ token }: CalendarAuthProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      setIsDarkMode(hour < 6 || hour > 18); // Diurno: 6-18, Nocturno: fuera
    };
    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAuthenticatedAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError('Error al cargar las citas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [token]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAppointmentsForDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    return appointments.filter(apt => apt.date === dateStr);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const openAppointmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className={`max-w-md mx-auto text-center ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-sm p-8`}>
          <div className="flex flex-col items-center space-y-4">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
            <span className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cargando citas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className={`max-w-md mx-auto text-center ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-sm p-8`}>
          <div className="flex flex-col items-center space-y-4">
            <div className={`text-red-600 text-xl font-semibold`}>{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <CalendarHeader isDarkMode={isDarkMode} />
          <MonthNavigation 
            isDarkMode={isDarkMode} 
            currentMonth={currentMonth} 
            formatMonth={formatMonth} 
            navigateMonth={navigateMonth} 
          />
          <CalendarGrid 
            isDarkMode={isDarkMode} 
            days={days} 
            getAppointmentsForDay={getAppointmentsForDay} 
            currentMonth={currentMonth} 
            openAppointmentModal={openAppointmentModal} 
          />
          <AppointmentList 
            isDarkMode={isDarkMode} 
            appointments={appointments} 
            currentMonth={currentMonth} 
            formatMonth={formatMonth} 
            openAppointmentModal={openAppointmentModal} 
          />
          <Legend isDarkMode={isDarkMode} />
        </div>
      </div>
      <AppointmentModal 
        isDarkMode={isDarkMode} 
        selectedAppointment={selectedAppointment} 
        closeModal={closeModal} 
      />
    </div>
  );
}
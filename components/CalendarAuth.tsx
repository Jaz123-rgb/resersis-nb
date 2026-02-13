'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedAppointments } from '@/lib/appointmentsAuthService';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500 dark:bg-green-600';
      case 'PENDING':
        return 'bg-yellow-500 dark:bg-yellow-600';
      default:
        return 'bg-blue-500 dark:bg-blue-600';
    }
  };

  const openAppointmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
              <span className="text-lg text-gray-700 dark:text-gray-300">Cargando citas...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-red-600 text-xl font-semibold">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Mis Citas Programadas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Gestiona y visualiza todas tus citas</p>
          </div>

          {/* Navegación del mes */}
          <div className="w-full mb-4 flex items-center justify-between">
            <button 
              onClick={() => navigateMonth('prev')}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-900 border-gray-300 dark:border-gray-700 text-black dark:text-white transition-colors"
            >
              ← Anterior
            </button>
            
            <h2 className="text-2xl font-semibold text-black dark:text-white capitalize">
              {formatMonth(currentMonth)}
            </h2>
            
            <button 
              onClick={() => navigateMonth('next')}
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-900 border-gray-300 dark:border-gray-700 text-black dark:text-white transition-colors"
            >
              Siguiente →
            </button>
          </div>

          {/* Calendario */}
          <div className="bg-black">
            {/* Encabezados de días */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="font-medium text-gray-600 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* Días vacíos al inicio */}
              {Array.from({ length: days.filter(d => d === null).length }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 border rounded bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700" />
              ))}
              
              {/* Días del mes */}
              {days.filter(day => day !== null).map(day => {
                const dayAppointments = getAppointmentsForDay(day!);
                const isToday = day && 
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear();
                const hasAppointments = dayAppointments.length > 0;
                
                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => dayAppointments.length > 0 && openAppointmentModal(dayAppointments[0])}
                    className={`h-20 border rounded flex flex-col items-start justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      isToday 
                        ? "border-blue-500 bg-white dark:bg-black" 
                        : hasAppointments 
                          ? "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20" 
                          : "border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isToday 
                        ? "text-blue-600" 
                        : hasAppointments 
                          ? "text-green-700 dark:text-green-400"
                          : "text-black dark:text-white"
                    }`}>
                      {day}
                    </span>
                    {hasAppointments && (
                      <div className="flex flex-col items-start w-full">
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {dayAppointments.length} cita{dayAppointments.length > 1 ? 's' : ''}
                        </div>
                        {dayAppointments.slice(0, 2).map((appointment, index) => (
                          <div 
                            key={`${appointment.date}-${appointment.time}-${index}`} 
                            className="text-xs text-gray-600 dark:text-gray-400 truncate w-full"
                          >
                            {appointment.time.slice(0, 5)} - {appointment.guestName}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            +{dayAppointments.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de citas del mes actual */}
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
              Citas de {formatMonth(currentMonth)}
            </h3>
            
            {appointments.filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate.getMonth() === currentMonth.getMonth() && 
                     aptDate.getFullYear() === currentMonth.getFullYear();
            }).length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mt-4">No hay citas programadas este mes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .filter(apt => {
                    const aptDate = new Date(apt.date);
                    return aptDate.getMonth() === currentMonth.getMonth() && 
                           aptDate.getFullYear() === currentMonth.getFullYear();
                  })
                  .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                  .map(apt => (
                    <div 
                      key={apt.id} 
                      className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => openAppointmentModal(apt)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <h4 className="font-medium text-black dark:text-white">{apt.guestName}</h4>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {apt.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{apt.reason}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(apt.date).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{apt.time.slice(0, 5)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Leyenda */}
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">Estado de las citas</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Citas programadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded border border-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Día actual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de cita */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-black dark:text-white">Detalles de la Cita</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paciente</label>
                <p className="text-lg text-black dark:text-white">{selectedAppointment.guestName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <p className="text-gray-600 dark:text-gray-400">{selectedAppointment.guestEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
                  <p className="text-black dark:text-white">{new Date(selectedAppointment.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hora</label>
                  <p className="text-black dark:text-white">{selectedAppointment.time.slice(0, 5)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motivo</label>
                <p className="text-gray-600 dark:text-gray-400">{selectedAppointment.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {selectedAppointment.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                </span>
              </div>

              {selectedAppointment.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de creación</label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedAppointment.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-gray-300 dark:border-gray-700">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span className="text-lg text-gray-700 dark:text-gray-300">Cargando citas...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="text-red-500 dark:text-red-400 text-lg font-medium">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Mis Citas Programadas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Gestiona y visualiza todas tus citas</p>
          </div>

          {/* Navegación del mes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigateMonth('prev')}
                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                {formatMonth(currentMonth)}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Siguiente
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendario */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
            <div className="grid grid-cols-7 gap-0">
              {/* Encabezados de días */}
              {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                <div key={day} className="bg-blue-600 dark:bg-blue-700 text-white p-4 text-center font-semibold">
                  <div className="hidden sm:block">{day}</div>
                  <div className="sm:hidden">{day.slice(0, 3)}</div>
                </div>
              ))}
              
              {/* Días del mes */}
              {days.map((day, index) => {
                const dayAppointments = day ? getAppointmentsForDay(day) : [];
                const isToday = day && 
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isToday ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600' : ''
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {day}
                          {isToday && <div className="text-xs text-blue-500 dark:text-blue-400">Hoy</div>}
                        </div>
                        
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map(apt => (
                            <div
                              key={apt.id}
                              className={`text-xs p-2 rounded-md text-white shadow-sm ${getStatusColor(apt.status)} hover:opacity-80 cursor-pointer transition-opacity`}
                              title={`${apt.guestName} - ${apt.reason} - ${apt.time}`}
                              onClick={() => openAppointmentModal(apt)}
                            >
                              <div className="font-medium">{apt.time.slice(0, 5)}</div>
                              <div className="truncate">{apt.guestName}</div>
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              +{dayAppointments.length - 3} más
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de citas del mes actual */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Citas de {formatMonth(currentMonth)}
            </h3>
            
            {appointments.filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate.getMonth() === currentMonth.getMonth() && 
                     aptDate.getFullYear() === currentMonth.getFullYear();
            }).length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">No hay citas programadas este mes</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800"
                      onClick={() => openAppointmentModal(apt)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{apt.guestName}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(apt.status)}`}>
                          {apt.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">{apt.reason}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(apt.date).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {apt.time.slice(0, 5)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Leyenda */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Estado de las citas</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Confirmadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 dark:bg-yellow-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Pendientes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Programadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de cita */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Detalles de la Cita</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Paciente</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{selectedAppointment.guestName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-800 dark:text-gray-200">{selectedAppointment.guestEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Fecha</label>
                  <p className="text-gray-800 dark:text-gray-200">{new Date(selectedAppointment.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Hora</label>
                  <p className="text-gray-800 dark:text-gray-200">{selectedAppointment.time.slice(0, 5)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Motivo</label>
                <p className="text-gray-800 dark:text-gray-200">{selectedAppointment.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Estado</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                </span>
              </div>

              {selectedAppointment.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de creación</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedAppointment.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
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

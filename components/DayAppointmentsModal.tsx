"use client";
import React from "react";
import { Appointment } from "../app/api/interface/ApointmentsInterface";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  appointments: Appointment[];
  onCreateAppointment?: () => void;
};

export default function DayAppointmentsModal({ 
  isOpen, 
  onClose, 
  date, 
  appointments,
  onCreateAppointment 
}: Props) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-700">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Citas del día
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {formatDate(date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-zinc-400 dark:text-zinc-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.01M3 7h18M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7M10 11v6m4-6v6" />
                </svg>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                No hay citas programadas para este día
              </p>
              {onCreateAppointment && (
                <button
                  onClick={onCreateAppointment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear nueva cita
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {appointments.length} cita{appointments.length > 1 ? 's' : ''} programada{appointments.length > 1 ? 's' : ''}
                </p>
                {onCreateAppointment && (
                  <button
                    onClick={onCreateAppointment}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Nueva cita
                  </button>
                )}
              </div>
              
              {appointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-medium text-zinc-900 dark:text-white">
                        {formatTime(appointment.time)}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Paciente:
                      </span>
                      <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {appointment.guestName}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Email:
                      </span>
                      <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {appointment.guestEmail}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Motivo:
                      </span>
                      <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {appointment.reason}
                      </span>
                    </div>
                    
                    {appointment.cancelledReason && (
                      <div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">
                          Motivo de cancelación:
                        </span>
                        <span className="ml-2 text-sm text-red-600 dark:text-red-400">
                          {appointment.cancelledReason}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
                    Creada: {new Date(appointment.createdAt).toLocaleString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
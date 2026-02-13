"use client";
import React from "react";

interface AppointmentByMonth {
  date: string;
  time: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  appointments: AppointmentByMonth[];
  onCreateAppointment: () => void;
};

export default function DayAppointmentsModal({
  isOpen,
  onClose,
  date,
  appointments,
  onCreateAppointment,
}: Props) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-lg shadow-xl p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">
            Citas del {formatDate(date)}
          </h2>
          <button
            onClick={onClose}
            className="px-2 py-1 text-sm rounded bg-zinc-200 dark:bg-zinc-800 dark:text-white"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
          {appointments.map((appointment, index) => (
            <div
              key={`${appointment.date}-${appointment.time}-${index}`}
              className="border rounded p-3 bg-zinc-50 dark:bg-zinc-900"
            >
              <div className="font-medium text-sm dark:text-white">
                {appointment.time.slice(0, 5)}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {appointment.date}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onCreateAppointment}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear nueva cita
        </button>
      </div>
    </div>
  );
}
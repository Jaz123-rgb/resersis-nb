"use client";
import React from "react";
import { Appointment } from "../app/api/interface/ApointmentsInterface";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  appointments: Appointment[];
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
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded p-3 bg-zinc-50 dark:bg-zinc-900"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-sm dark:text-white">
                  {appointment.time.slice(0, 5)} - {appointment.guestName}
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  appointment.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                {appointment.reason}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {appointment.guestEmail}
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
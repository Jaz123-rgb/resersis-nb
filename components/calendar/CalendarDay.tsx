import React from 'react';
import { Appointment } from '../../app/api/interface/ApointmentsInterface';
import { CALENDAR_SETTINGS } from '../../lib/constants';

interface CalendarDayProps {
  day: number;
  isToday: boolean;
  appointments: Appointment[];
  onClick: () => void;
}

export default function CalendarDay({ day, isToday, appointments, onClick }: CalendarDayProps) {
  const hasAppointments = appointments.length > 0;

  return (
    <button
      onClick={onClick}
      className={`h-20 border rounded flex flex-col items-start justify-between p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
        isToday 
          ? "border-blue-500" 
          : hasAppointments 
            ? "border-green-400 dark:border-green-500" 
            : "border-zinc-200 dark:border-zinc-700"
      } ${hasAppointments ? "bg-green-50 dark:bg-green-900/20" : ""}`}
    >
      <span className={`text-sm font-medium ${
        isToday 
          ? "text-blue-600" 
          : hasAppointments 
            ? "text-green-700 dark:text-green-400"
            : "text-zinc-700 dark:text-zinc-200"
      }`}>
        {day}
      </span>
      {hasAppointments && (
        <div className="flex flex-col items-start w-full">
          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
            {appointments.length} cita{appointments.length > 1 ? 's' : ''}
          </div>
          {appointments.slice(0, CALENDAR_SETTINGS.MAX_APPOINTMENTS_DISPLAY).map((appointment, index) => (
            <div 
              key={`${appointment.date}-${appointment.time}-${index}`} 
              className="text-xs text-zinc-600 dark:text-zinc-400 truncate w-full"
            >
              {appointment.time.slice(0, 5)} - {appointment.guestName}
            </div>
          ))}
          {appointments.length > CALENDAR_SETTINGS.MAX_APPOINTMENTS_DISPLAY && (
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              +{appointments.length - CALENDAR_SETTINGS.MAX_APPOINTMENTS_DISPLAY} más
            </div>
          )}
        </div>
      )}
    </button>
  );
}

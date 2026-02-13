import { Appointment } from '../../app/api/interface/ApointmentsInterface';
import { CalendarDay } from '../types/calendar';

export function getEmptyDaysAtStart(startWeekday: number): number {
  return startWeekday === 0 ? 0 : startWeekday;
}

export function createCalendarDays(
  daysInMonth: number,
  year: number,
  month: number,
  appointments: Appointment[],
  isToday: (day: number) => boolean
): CalendarDay[] {
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayAppointments = getAppointmentsForDay(day, year, month, appointments);
    
    return {
      day,
      isToday: isToday(day),
      hasAppointments: dayAppointments.length > 0,
      appointmentCount: dayAppointments.length
    };
  });
}

export function getAppointmentsForDay(
  day: number, 
  year: number, 
  month: number, 
  appointments: Appointment[]
): Appointment[] {
  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return appointments.filter(appointment => appointment.date === dateString);
}

export function getDayClasses(
  isToday: boolean, 
  hasAppointments: boolean
): string {
  const baseClasses = "h-20 border rounded flex flex-col items-start justify-between p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors";
  
  const borderClasses = isToday 
    ? "border-blue-500" 
    : hasAppointments 
      ? "border-green-400 dark:border-green-500" 
      : "border-zinc-200 dark:border-zinc-700";
  
  const backgroundClasses = hasAppointments ? "bg-green-50 dark:bg-green-900/20" : "";
  
  return `${baseClasses} ${borderClasses} ${backgroundClasses}`;
}

export function getDayTextClasses(
  isToday: boolean,
  hasAppointments: boolean
): string {
  const baseClasses = "text-sm font-medium";
  
  const colorClasses = isToday 
    ? "text-blue-600" 
    : hasAppointments 
      ? "text-green-700 dark:text-green-400"
      : "text-zinc-700 dark:text-zinc-200";
  
  return `${baseClasses} ${colorClasses}`;
}

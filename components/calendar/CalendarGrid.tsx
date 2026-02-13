import React from 'react';
import { Appointment } from '../../app/api/interface/ApointmentsInterface';
import CalendarDay from './CalendarDay';
import { WEEKDAYS } from '../../lib/constants';

interface CalendarGridProps {
  startWeekday: number;
  daysInMonth: number;
  onDayClick: (day: number) => void;
  getAppointmentsForDay: (day: number) => Appointment[];
  isToday: (day: number) => boolean;
}

export default function CalendarGrid({
  startWeekday,
  daysInMonth,
  onDayClick,
  getAppointmentsForDay,
  isToday
}: CalendarGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="font-medium text-zinc-600 dark:text-zinc-300">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startWeekday === 0 ? 0 : startWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 border rounded bg-zinc-50 dark:bg-zinc-900" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <CalendarDay
              key={`day-${day}`}
              day={day}
              isToday={isToday(day)}
              appointments={getAppointmentsForDay(day)}
              onClick={() => onDayClick(day)}
            />
          );
        })}
      </div>
    </>
  );
}

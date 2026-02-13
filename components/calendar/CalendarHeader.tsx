import React from 'react';
import { DATE_FORMATS } from '../../lib/constants';

interface CalendarHeaderProps {
  displayedYear: number;
  displayedMonth: number;
  loading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({
  displayedYear,
  displayedMonth,
  loading,
  onPrevMonth,
  onNextMonth
}: CalendarHeaderProps) {
  return (
    <div className="w-full mb-4 flex items-center justify-between">
      <button
        onClick={onPrevMonth}
        className="px-3 py-1 rounded border bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
        disabled={loading}
      >
        ← Anterior
      </button>
      <h1 className="text-2xl font-semibold dark:text-white">
        {new Date(displayedYear, displayedMonth, 1).toLocaleString(DATE_FORMATS.DISPLAY_MONTH, {
          month: "long",
          year: "numeric",
        })}
        {loading && <span className="ml-2 text-sm text-blue-500">Cargando...</span>}
      </h1>
      <button
        onClick={onNextMonth}
        className="px-3 py-1 rounded border bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
        disabled={loading}
      >
        Siguiente →
      </button>
    </div>
  );
}

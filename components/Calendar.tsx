"use client";
import React, { useState } from "react";

type Props = {
  onSelectDate: (isoDate: string) => void;
};

export default function Calendar({ onSelectDate }: Props) {
  const now = new Date();
  const [displayedYear, setDisplayedYear] = useState(now.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(now.getMonth()); // 0-11

  const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1);
  const lastDayOfMonth = new Date(displayedYear, displayedMonth + 1, 0);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const goPrevMonth = () => {
    setDisplayedMonth((m) => {
      if (m === 0) {
        setDisplayedYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goNextMonth = () => {
    setDisplayedMonth((m) => {
      if (m === 11) {
        setDisplayedYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const openWithDay = (day: number) => {
    const mm = String(displayedMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onSelectDate(`${displayedYear}-${mm}-${dd}`);
  };

  const isToday = (day: number) => {
    const t = new Date();
    return (
      day === t.getDate() &&
      displayedMonth === t.getMonth() &&
      displayedYear === t.getFullYear()
    );
  };

  return (
    <div className="w-full">
      <div className="w-full mb-4 flex items-center justify-between">
        <button
          onClick={goPrevMonth}
          className="px-3 py-1 rounded border bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
        >
          ← Anterior
        </button>
        <h1 className="text-2xl font-semibold dark:text-white">
          {new Date(displayedYear, displayedMonth, 1).toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <button
          onClick={goNextMonth}
          className="px-3 py-1 rounded border bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
        >
          Siguiente →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
        {weekdays.map((w) => (
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
          const todayCell = isToday(day);
          return (
            <button
              key={`day-${day}`}
              onClick={() => openWithDay(day)}
              className={`h-20 border rounded flex flex-col items-end p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                todayCell ? "border-blue-500" : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <span className={`text-sm ${todayCell ? "text-blue-600" : "text-zinc-700 dark:text-zinc-200"}`}>
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

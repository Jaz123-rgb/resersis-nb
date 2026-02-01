"use client";
import React, { useState, useEffect } from "react";
import { AppointmentsResponse, Appointment } from "../app/api/interface/ApointmentsInterface";
import getAllTheAppointmentsByMonth from "../app/api/services/getAllTheAppointmentsByMonth";
import DayAppointmentsModal from "./DayAppointmentsModal";

type Props = {
  onSelectDate: (isoDate: string) => void;
};

export default function Calendar({ onSelectDate }: Props) {
  const now = new Date();
  const [displayedYear, setDisplayedYear] = useState(now.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(now.getMonth()); // 0-11
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para el modal de citas del día
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);

  const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1);
  const lastDayOfMonth = new Date(displayedYear, displayedMonth + 1, 0);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Función para cargar las citas del mes
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAllTheAppointmentsByMonth({
        year: displayedYear,
        month: displayedMonth + 1, // API espera 1-12, useState usa 0-11
        page: 0,
        size: 100 // Traer todas las citas del mes
      });
      setAppointments(response.content);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar citas cuando cambie el mes o año
  useEffect(() => {
    loadAppointments();
  }, [displayedYear, displayedMonth]);

  // Función para obtener citas de un día específico
  const getAppointmentsForDay = (day: number) => {
    const dateString = `${displayedYear}-${String(displayedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter(appointment => appointment.date === dateString);
  };

  // Manejar click en día
  const handleDayClick = (day: number) => {
    const mm = String(displayedMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateString = `${displayedYear}-${mm}-${dd}`;
    
    const dayAppointments = getAppointmentsForDay(day);
    
    if (dayAppointments.length > 0) {
      // Si hay citas, mostrar el modal de citas del día
      setSelectedDate(dateString);
      setSelectedDayAppointments(dayAppointments);
      setShowDayModal(true);
    } else {
      // Si no hay citas, permitir crear una nueva
      onSelectDate(dateString);
    }
  };

  // Manejar creación de nueva cita desde el modal
  const handleCreateAppointment = () => {
    setShowDayModal(false);
    onSelectDate(selectedDate);
  };

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

  const isToday = (day: number) => {
    const t = new Date();
    return (
      day === t.getDate() &&
      displayedMonth === t.getMonth() &&
      displayedYear === t.getFullYear()
    );
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full mb-4 flex items-center justify-between">
          <button
            onClick={goPrevMonth}
            className="px-3 py-1 rounded border bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
            disabled={loading}
          >
            ← Anterior
          </button>
          <h1 className="text-2xl font-semibold dark:text-white">
            {new Date(displayedYear, displayedMonth, 1).toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
            {loading && <span className="ml-2 text-sm text-blue-500">Cargando...</span>}
          </h1>
          <button
            onClick={goNextMonth}
            className="px-3 py-1 rounded border bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
            disabled={loading}
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
            const dayAppointments = getAppointmentsForDay(day);
            const hasAppointments = dayAppointments.length > 0;

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDayClick(day)}
                className={`h-20 border rounded flex flex-col items-start justify-between p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                  todayCell 
                    ? "border-blue-500" 
                    : hasAppointments 
                      ? "border-green-400 dark:border-green-500" 
                      : "border-zinc-200 dark:border-zinc-700"
                } ${hasAppointments ? "bg-green-50 dark:bg-green-900/20" : ""}`}
              >
                <span className={`text-sm font-medium ${
                  todayCell 
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
                      {dayAppointments.length} cita{dayAppointments.length > 1 ? 's' : ''}
                    </div>
                    {dayAppointments.slice(0, 2).map((appointment, index) => (
                      <div 
                        key={appointment.id} 
                        className="text-xs text-zinc-600 dark:text-zinc-400 truncate w-full"
                      >
                        {appointment.time.slice(0, 5)} - {appointment.guestName}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-zinc-500 dark:text-zinc-500">
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

      {/* Modal para mostrar citas del día */}
      <DayAppointmentsModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        date={selectedDate}
        appointments={selectedDayAppointments}
        onCreateAppointment={handleCreateAppointment}
      />
    </>
  );
}
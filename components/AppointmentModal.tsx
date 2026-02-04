"use client";
import React, { useEffect, useState } from "react";
import getAllTheAppointmentsByMonth from "../app/api/services/getAllTheAppointmentsByMonth";

type FormState = {
  date: string;
  time: string;
  reason: string;
  guestName: string;
  guestEmail: string;
};

type Props = {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  result: any | null;
};

export default function AppointmentModal({
  form,
  onChange,
  onSubmit,
  onClose,
  loading,
  error,
  result,
}: Props) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  // Cargar horarios ocupados cuando cambie la fecha
  useEffect(() => {
    if (!form.date) {
      setOccupiedTimes([]);
      return;
    }

    const fetchOccupiedTimes = async () => {
      setLoadingTimes(true);
      try {
        const [year, month] = form.date.split('-');
        const response = await getAllTheAppointmentsByMonth({
          year: parseInt(year),
          month: parseInt(month),
          page: 0,
          size: 100
        });
        
        // Filtrar citas del día seleccionado
        const dayAppointments = response.content?.filter((apt: any) => apt.date === form.date) || [];
        const times = dayAppointments.map((apt: any) => apt.time.slice(0, 5)); // Formato HH:MM
        setOccupiedTimes(times);
      } catch (err) {
        console.error('Error al cargar horarios ocupados:', err);
        setOccupiedTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchOccupiedTimes();
  }, [form.date]);

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onClose(), 180);
  };

  // Generar horarios disponibles (9:00 AM - 5:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    
    // 9:00 AM - 12:00 PM (mañana)
    for (let hour = 9; hour < 12; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    // Pausa del almuerzo: 12:00 PM - 1:00 PM
    
    // 1:00 PM - 5:00 PM (tarde) - último slot a las 4:00 PM para terminar a las 5:00 PM
    for (let hour = 13; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };

  // Verificar si una hora está disponible
  const isTimeSlotAvailable = (timeSlot: string) => {
    return !occupiedTimes.includes(timeSlot);
  };

  // Obtener horarios disponibles
  const allTimeSlots = generateTimeSlots();
  const availableTimeSlots = allTimeSlots.filter(slot => isTimeSlotAvailable(slot));

  // Formatear hora para mostrar (12:00 -> 12:00 PM)
  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum < 12 ? 'AM' : 'PM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const endHour = hourNum + 1;
    const endPeriod = endHour < 12 || endHour === 24 ? 'AM' : 'PM';
    const displayEndHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
    
    return `${time} - ${endHour.toString().padStart(2, '0')}:00 (${displayHour}:${minute} ${period} - ${displayEndHour}:00 ${endPeriod})`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${entered && !exiting ? "overlay-in" : "overlay-out"}`}
        onClick={handleClose}
        style={{ willChange: "opacity" }}
      />
      <div
        className={`relative bg-white dark:bg-zinc-950 w-full max-w-md rounded shadow-lg p-4 ${
          entered && !exiting ? "modal-in" : "modal-out"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold dark:text-white">Nueva cita</h2>
          <button
            onClick={handleClose}
            className="px-2 py-1 text-sm rounded bg-zinc-200 dark:bg-zinc-800 dark:text-white"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3 text-left">
          <div className="grid grid-cols-1 gap-3">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Fecha de la cita
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={onChange}
                className="border rounded p-2 w-full dark:bg-zinc-800 dark:text-white"
                required
              />
            </div>

            {/* Horario */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Horario disponible (Duración: 1 hora)
              </label>
              <select
                name="time"
                value={form.time}
                onChange={handleTimeChange}
                className="border rounded p-2 w-full bg-white dark:bg-zinc-800 dark:text-white"
                required
                disabled={loadingTimes || !form.date}
              >
                <option value="">
                  {loadingTimes 
                    ? "Cargando horarios..." 
                    : !form.date 
                      ? "Primero selecciona una fecha"
                      : availableTimeSlots.length === 0
                        ? "No hay horarios disponibles"
                        : "Seleccionar horario"
                  }
                </option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTimeDisplay(slot)}
                  </option>
                ))}
              </select>
              
              {/* Información adicional */}
              {form.date && (
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {loadingTimes ? (
                    <span>Verificando disponibilidad...</span>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Horarios disponibles: {availableTimeSlots.length}</span>
                        <span>Horarios ocupados: {occupiedTimes.length}</span>
                      </div>
                      {occupiedTimes.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">Ocupados:</span> {occupiedTimes.join(', ')}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Información del horario de trabajo */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
              <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Horarios de atención:
              </div>
              <div className="text-blue-700 dark:text-blue-400 text-xs space-y-1">
                <div>• Mañana: 9:00 AM - 12:00 PM</div>
                <div>• Tarde: 1:00 PM - 5:00 PM</div>
                <div>• Cada cita tiene duración de 1 hora</div>
                <div>• Almuerzo: 12:00 PM - 1:00 PM (cerrado)</div>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nombre completo
              </label>
              <input
                name="guestName"
                type="text"
                value={form.guestName}
                onChange={onChange}
                placeholder="Nombre del paciente"
                className="border rounded p-2 w-full dark:bg-zinc-800 dark:text-white"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Correo electrónico
              </label>
              <input
                name="guestEmail"
                type="email"
                value={form.guestEmail}
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                className="border rounded p-2 w-full dark:bg-zinc-800 dark:text-white"
                required
              />
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Motivo de la consulta
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={onChange}
                placeholder="Describe brevemente el motivo de tu cita"
                className="border rounded p-2 w-full dark:bg-zinc-800 dark:text-white"
                rows={3}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || loadingTimes || !form.time}
            className="mt-2 h-10 rounded bg-black text-white px-4 disabled:opacity-50 dark:bg-zinc-200 dark:text-black"
          >
            {loading ? "Creando cita..." : "Crear cita"}
          </button>
          
          {error && (
            <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {String(error)}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes overlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalIn {
          0% { opacity: 0; transform: translateY(6px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(6px) scale(0.98); }
        }
        .overlay-in { animation: overlayIn 160ms ease-out forwards; }
        .overlay-out { animation: overlayOut 160ms ease-in forwards; pointer-events: none; }
        .modal-in { animation: modalIn 180ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .modal-out { animation: modalOut 180ms ease-in forwards; pointer-events: none; }
      `}</style>
    </div>
  );
}
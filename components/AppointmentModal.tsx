"use client";
import React, { useEffect, useState } from "react";

type FormState = {
  date: string;
  time: string;
  reason: string;
  guestName: string;
  guestEmail: string;
};

type Props = {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    // bloquear el scroll del body mientras el modal está activo
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onClose(), 180); // igualar duración de salida
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Overlay con opacidad y blur */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${entered && !exiting ? "overlay-in" : "overlay-out"}`}
        onClick={handleClose}
        style={{ willChange: "opacity" }}
      />
      {/* Contenedor del modal */}
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
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              className="border rounded p-2"
            />
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={onChange}
              className="border rounded p-2"
            />
            <input
              name="guestName"
              type="text"
              value={form.guestName}
              onChange={onChange}
              placeholder="Nombre del invitado"
              className="border rounded p-2"
            />
            <input
              name="guestEmail"
              type="email"
              value={form.guestEmail}
              onChange={onChange}
              placeholder="Correo del invitado"
              className="border rounded p-2"
            />
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              placeholder="Motivo"
              className="border rounded p-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 rounded bg-black text-white px-4 disabled:opacity-50 dark:bg-zinc-200 dark:text-black"
          >
            {loading ? "Enviando..." : "Crear cita invitado"}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{String(error)}</p>}
          {result && (
            <pre className="mt-3 text-xs bg-zinc-100 p-3 rounded dark:bg-zinc-900 text-left overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
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

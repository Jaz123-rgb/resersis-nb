"use client";
import React, { useEffect } from "react";

type Props = {
  title?: string;
  message?: string;
  autoCloseMs?: number;
  onClose: () => void;
};

export default function SuccessModal({ title = "Éxito", message, autoCloseMs = 2000, onClose }: Props) {
  useEffect(() => {
    if (!autoCloseMs) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-xl shadow-xl p-6 text-center">
        <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
          <svg viewBox="0 0 52 52" className="h-12 w-12 text-green-600">
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-20"
            />
            <path
              d="M14 27 l8 8 l16 -18"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: "dash 800ms ease-out forwards 200ms" }}
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1 dark:text-white">{title}</h3>
        {message && <p className="text-sm text-zinc-600 dark:text-zinc-300">{message}</p>}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            aria-label="Cerrar"
          >
            Listo
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

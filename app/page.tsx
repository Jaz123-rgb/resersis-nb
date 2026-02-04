"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import AppointmentModal from "@/components/AppointmentModal";
import SuccessModal from "@/components/SuccessModal";

export default function Home() {
  const [form, setForm] = useState({
    date: "2024-01-15",
    time: "14:00:00",
    reason: "Consulta médica",
    guestName: "Juan Pérez",
    guestEmail: "juan.perez@email.com",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("Cita creada correctamente");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("https://recersis-api.fly.dev/api/appointments/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${text || "No se pudo crear la cita"}`);
      }
      // Soportar respuestas sin cuerpo (204/201 sin body)
      const text = await res.text();
      let data: any | null = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          // ignorar parseo si no es JSON válido
        }
      }
      setResult(data);
      // Mensaje opcional con datos del backend
      if (data?.id) {
        setSuccessMessage(`Cita #${data.id} creada correctamente`);
      } else {
        setSuccessMessage("Cita creada correctamente");
      }
      setShowModal(false);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al crear la cita");
    } finally {
      setLoading(false);
    }
  };

  const openWithDate = (isoDate: string) => {
    // Conservar la fecha seleccionada; vaciar los demás campos
    setForm({
      date: isoDate,
      time: "",
      reason: "",
      guestName: "",
      guestEmail: "",
    });
    setShowModal(true);
    setError(null);
    setResult(null);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Calendar onSelectDate={openWithDate} />
        {showModal && (
          <AppointmentModal
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
            error={error ? String(error) : null}
            result={result}
            onClose={closeModal}
          />
        )}
        {showSuccess && (
          <SuccessModal
            title="¡Listo!"
            message={successMessage}
            autoCloseMs={2200}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </main>
    </div>
  );
}

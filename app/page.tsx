"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import AppointmentModal from "@/components/AppointmentModal";
import SuccessModal from "@/components/SuccessModal";
import { createGuestAppointment } from "@/app/api/services/appointments";

export default function Home() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    reason: "",
    guestName: "",
    guestEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("Cita creada correctamente");
  
  // Key para forzar refresh del calendario
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  // Actualizar tipo para incluir HTMLSelectElement
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await createGuestAppointment(form);
      setResult(data);
      
      if (data?.id) {
        setSuccessMessage(`Cita #${data.id} creada correctamente`);
      } else {
        setSuccessMessage("Cita creada correctamente");
      }
      
      setShowModal(false);
      setShowSuccess(true);
      
      // Forzar actualización del calendario
      setCalendarRefreshKey(prev => prev + 1);
      
    } catch (err: any) {
      setError(err.message || "Error al crear la cita");
    } finally {
      setLoading(false);
    }
  };

  const openWithDate = (isoDate: string) => {
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
        <Calendar 
          onSelectDate={openWithDate} 
          refreshKey={calendarRefreshKey}
        />
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
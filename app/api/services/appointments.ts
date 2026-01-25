export type GuestAppointmentRequest = {
  date: string;
  time: string;
  reason: string;
  guestName: string;
  guestEmail: string;
};

export type GuestAppointmentResponse = {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  user: null | Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  cancelledReason: string | null;
  cancelledAt: string | null;
  guestName: string;
  guestEmail: string;
  managementToken: string;
  pending: boolean;
  confirmed: boolean;
  active: boolean;
};

export async function createGuestAppointment(payload: GuestAppointmentRequest, baseUrl = "http://localhost:8080") {
  const res = await fetch(`${baseUrl}/api/appointments/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${text || "No se pudo crear la cita"}`);
  }

  const data = (await res.json()) as GuestAppointmentResponse;
  return data;
}

"use client";
import React, { useEffect, useRef, useState } from "react";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "TEST-9447557c-78f5-4cf9-af31-b383ed5aa658";

async function loadMercadoPagoSdk() {
  if (typeof window === "undefined") return;
  // si ya está cargado, devolver inmediatamente
  // @ts-ignore
  if (window.MercadoPago) return window.MercadoPago;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      resolve(window.MercadoPago);
    };
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}

type Appointment = {
  id: number;
  date: string;
  time: string;
  reason?: string;
  status?: string;
  guestName?: string;
  guestEmail?: string;
  managementToken?: string;
  [k: string]: any;
};

export default function CardPaymentBrick({ appointment }: { appointment?: Appointment }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await loadMercadoPagoSdk();
        // @ts-ignore
        const mp = new window.MercadoPago(PUBLIC_KEY, { locale: "es-AR" });
        const bricksBuilder = mp.bricks();

        const settings = {
          initialization: {
            amount: 100.99,
          },
          callbacks: {
            onReady: () => {
              if (!mounted) return;
              setReady(true);
            },
            onSubmit: (formData: any, additionalData: any) => {
              setStatusMessage("Procesando pago...");
              // Adjuntar appointment al additionalData para que viaje al backend
              if (appointment) additionalData = { ...additionalData, appointment };

              console.log("MP Brick onSubmit", { formData, additionalData });

              return new Promise((resolve, reject) => {
                const amountString =
                  typeof formData.transaction_amount === "number"
                    ? formData.transaction_amount.toFixed(2)
                    : String(formData.transaction_amount);

                // Adaptar a formato solicitado por el backend: { formData, additionalData }
                // Enriquecer formData.payer con datos de la appointment si están disponibles
                const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

                const payer = {
                  ...(formData.payer || {}),
                };
                if (appointment) {
                  if (appointment.guestName && !payer.first_name) {
                    // intentar separar nombre y apellido simple (todo en first_name si no hay espacio)
                    const parts = appointment.guestName.split(" ");
                    payer.first_name = parts.shift() || appointment.guestName;
                    payer.last_name = parts.join(" ") || payer.last_name || "";
                  }
                  if (!payer.email) payer.email = appointment.guestEmail || payer.email;
                  if (!payer.identification && formData.payer?.identification) payer.identification = formData.payer.identification;
                }

                const body = {
                  formData: {
                    ...formData,
                    payer,
                  },
                  additionalData: {
                    ...additionalData,
                    // asegurar que appointment venga dentro de additionalData (backend lo espera ahí)
                    appointment: appointment || additionalData.appointment || null,
                  },
                };

                fetch(`${API_BASE}/api/appointments/guest/payments/checkout`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Accept: "application/json" },
                  // evitar enviar cookies para no forzar Access-Control-Allow-Credentials
                  credentials: "omit",
                  body: JSON.stringify(body),
                })
                  .then(async (r) => {
                    if (r.ok) return r.json().catch(() => ({}));
                    const text = await r.text().catch(() => "");
                    const err = new Error(`HTTP ${r.status}: ${text}`);
                    // @ts-ignore
                    err.status = r.status;
                    // @ts-ignore
                    err.body = text;
                    throw err;
                  })
                  .then((response) => {
                    console.log("response /api/...:", response);
                    setSuccessData(response);
                    const auth = response?.authorization_code || response?.id || "";
                    setStatusMessage(
                      `Pago procesado correctamente${auth ? ` — referencia: ${auth}` : ""}`
                    );
                    setShowSuccessModal(true);
                    resolve(response);
                  })
                  .catch((error) => {
                    console.error("error /api/...:", error);
                    // @ts-ignore
                    if (error && (error.status === 403 || String(error).includes("HTTP 403"))) {
                      setStatusMessage("403 Forbidden: revisa permisos en el backend o el formato del request.");
                    } else {
                      setStatusMessage("Error al procesar el pago. Intenta de nuevo.");
                    }
                    reject(error);
                  });
              });
            },
            onError: (error: any) => {
              console.error("MP Brick error:", error);
              setStatusMessage("Ocurrió un error con el Brick.");
            },
          },
        } as any;

        // Asegurar que el contenedor tenga el id esperado
        const containerId = "cardPaymentBrick_container";
        if (containerRef.current) containerRef.current.id = containerId;

        // crear y montar el Brick
        // @ts-ignore
        const controller = await bricksBuilder.create("cardPayment", containerId, settings);
          // exponer por si se necesita en consola
          // @ts-ignore
          window.cardPaymentBrickController = controller;
      } catch (err) {
        console.error("Error montando Mercado Pago Brick:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div id="cardPaymentBrick_container" ref={containerRef} style={{ minHeight: 120 }} />
      {!ready && <p>Cargando Brick de Mercado Pago…</p>}
      {statusMessage && (
        <p
          style={{
            marginTop: 12,
            color: successData ? "#065f46" : "#b91c1c",
            background: successData ? "#ecfdf5" : "#ffefef",
            padding: "8px 12px",
            borderRadius: 6,
          }}
        >
          {statusMessage}
        </p>
      )}
      {successData && (
        <pre
          style={{
            marginTop: 8,
            maxHeight: 220,
            overflow: "auto",
            background: "#f8fafc",
            padding: 12,
            borderRadius: 6,
            color: "#0f172a",
            border: "1px solid #e6eef6",
            fontSize: 13,
            lineHeight: 1.4,
            fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(
            {
              id: successData.id,
              status: successData.status,
              authorization_code: successData.authorization_code,
              transaction_amount: successData.transaction_amount,
            },
            null,
            2
          )}
        </pre>
      )}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 8,
              maxWidth: 720,
              width: "100%",
              padding: 20,
              color: "#0f172a",
              boxShadow: "0 10px 30px rgba(2,6,23,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, color: "#0f172a" }}>Pago exitoso</h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "#374151" }}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <p style={{ marginTop: 8, color: "#0f172a" }}>{statusMessage}</p>

            <section style={{ marginTop: 12, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <strong style={{ color: "#111827" }}>Appointment:</strong>
                <div style={{ color: "#374151" }}>
                  <div>ID: {appointment?.id}</div>
                  <div>
                    Fecha: {appointment?.date} {appointment?.time}
                  </div>
                  <div>Paciente: {appointment?.guestName} ({appointment?.guestEmail})</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <strong style={{ color: "#111827" }}>Pago:</strong>
                <div style={{ color: "#374151" }}>
                  <div>Id pago: {successData?.id}</div>
                  <div>Estado: {successData?.status}</div>
                  <div>Autorización: {successData?.authorization_code}</div>
                  <div>Monto: {successData?.transaction_amount}</div>
                </div>
              </div>
            </section>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                  color: "#111827",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
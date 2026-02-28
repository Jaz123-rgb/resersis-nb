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
                    setStatusMessage("Pago procesado. Revisa la consola para detalles.");
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
      {statusMessage && <p style={{ marginTop: 12 }}>{statusMessage}</p>}
    </div>
  );
}

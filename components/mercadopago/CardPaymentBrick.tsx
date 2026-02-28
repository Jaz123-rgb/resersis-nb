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

                const submitData = {
                  type: "online",
                  total_amount: amountString,
                  external_reference: `appointment_${appointment?.id || "unknown"}`,
                  processing_mode: "automatic",
                  transactions: {
                    payments: [
                      {
                        amount: amountString,
                        payment_method: {
                          id: formData.payment_method_id,
                          type: additionalData.paymentTypeId,
                          token: formData.token,
                          installments: formData.installments,
                        },
                      },
                    ],
                  },
                  payer: {
                    email: formData.payer?.email || appointment?.guestEmail || null,
                    identification: formData.payer?.identification || null,
                  },
                  appointment: appointment || null,
                  raw: { formData, additionalData },
                };

                fetch("/api/appointments/guest/payments/checkout/adapted", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(submitData),
                })
                  .then((r) => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json().catch(() => ({}));
                  })
                  .then((response) => {
                    console.log("response /api/...:", response);
                    setStatusMessage("Pago procesado. Revisa la consola para detalles.");
                    resolve(response);
                  })
                  .catch((error) => {
                    console.error("error /api/...:", error);
                    setStatusMessage("Error al procesar el pago. Intenta de nuevo.");
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

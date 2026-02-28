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

export default function CardPaymentBrick() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

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
              return new Promise((resolve) => {
                // Aquí solo hacemos logging y resolvemos para simular envío
                console.log("MP Brick onSubmit", { formData, additionalData });
                resolve(null);
              });
            },
            onError: (error: any) => {
              console.error("MP Brick error:", error);
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
      <div
        id="cardPaymentBrick_container"
        ref={containerRef}
        style={{ minHeight: 120 }}
      />
      {!ready && <p>Cargando Brick de Mercado Pago…</p>}
    </div>
  );
}

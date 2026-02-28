import React from "react";
import CardPaymentBrick from "../../components/mercadopago/CardPaymentBrick";

export const metadata = {
	title: "Mercado Pago Brick",
};

export default function Page() {
	return (
		<main style={{ padding: 24 }}>
			<h1>Integración Brick - Mercado Pago (frontend)</h1>
			<p>Este componente monta únicamente el Brick de tarjeta en el frontend.</p>
			<section style={{ maxWidth: 720 }}>
				<CardPaymentBrick />
			</section>
		</main>
	);
}

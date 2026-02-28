import React from "react";
import CardPaymentBrick from "../../components/mercadopago/CardPaymentBrick";

export const metadata = {
	title: "Mercado Pago Brick",
};

export default function Page() {
	const appointment = {
		id: 30,
		date: "2026-01-12",
		time: "14:00:00",
		reason: "pruebas de la consulta",
		status: "PENDING",
		user: null,
		createdAt: "2026-02-28T04:05:09.244933",
		updatedAt: "2026-02-28T04:05:09.24508",
		cancelledReason: null,
		cancelledAt: null,
		guestName: "Jaziel Perez",
		guestEmail: "pjaziel723@gmail.com",
		managementToken: "fbade6748abc4db49f3b18a8760ee9a8",
		deletedAt: null,
		active: true,
		deleted: false,
		pending: true,
		confirmed: false,
	};

	return (
		<main style={{ padding: 24 }}>
			<h1>Integración Brick - Mercado Pago (frontend)</h1>
			<p>Este componente monta únicamente el Brick de tarjeta en el frontend.</p>
			<section style={{ maxWidth: 720 }}>
				<CardPaymentBrick appointment={appointment} />
			</section>
		</main>
	);
}

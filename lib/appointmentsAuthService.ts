interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: string;
  guestName: string;
  guestEmail: string;
  active: boolean;
  confirmed: boolean;
  pending: boolean;
}

export const getAuthenticatedAppointments = async (token: string): Promise<Appointment[]> => {
  try {
    const response = await fetch('https://recersis-api.onrender.com/api/appointments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las citas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

import { AppointmentsByMonthResponse } from "../types/AppointmentsByMonthTypes";

interface GetAppointmentsParams {
  year: number;
  month: number;
  page: number;
  size: number;
}

export default async function getAllTheAppointmentsByMonth(
  params: GetAppointmentsParams
): Promise<AppointmentsByMonthResponse> {
  const { year, month, page, size } = params;
  const url = `https://recersis-api.onrender.com/api/appointments/guest/by-month?year=${year}&month=${month}&page=${page}&size=${size}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: Failed to fetch appointments`);
  }
  
  return response.json();
}
import{AppointmentsResponse, GetAppointmentsByMonthParams} from"../interface/ApointmentsInterface";

export const getAllTheAppointmentsByMonth = async ({
    year,
    month,
    page = 0,
    size = 10
  }: GetAppointmentsByMonthParams): Promise<AppointmentsResponse> => {
    try {
      const url = new URL('http://localhost:8080/api/appointments/guest/by-month');
      url.searchParams.append('year', year.toString());
      url.searchParams.append('month', month.toString());
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', size.toString());
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al obtener las citas: ${response.status} ${response.statusText}`);
      }
  
      const data: AppointmentsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en getAllTheAppointmentsByMonth:', error);
      throw error;
    }
  };
  
  export default getAllTheAppointmentsByMonth;
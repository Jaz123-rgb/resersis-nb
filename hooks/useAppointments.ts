import { useState, useEffect } from 'react';
import { Appointment } from '../app/api/interface/ApointmentsInterface';
import { AppointmentsByMonthResponse } from '../app/api/types/AppointmentsByMonthTypes';
import getAllTheAppointmentsByMonth from '../app/api/services/getAllTheAppointmentsByMonth';
import { CALENDAR_SETTINGS } from '../lib/constants';
import { formatDateToISO } from '../lib/utils/dateUtils';

export function useAppointments(year: number, month: number, refreshKey?: number) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: AppointmentsByMonthResponse = await getAllTheAppointmentsByMonth({
        year,
        month: month + 1,
        page: 0,
        size: CALENDAR_SETTINGS.DEFAULT_PAGE_SIZE
      });
      setAppointments(response.content);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setError('Error al cargar las citas');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDay = (day: number) => {
    const dateString = formatDateToISO(year, month, day);
    return appointments.filter(appointment => appointment.date === dateString);
  };

  useEffect(() => {
    loadAppointments();
  }, [year, month, refreshKey]);

  return {
    appointments,
    loading,
    error,
    getAppointmentsForDay,
    refreshAppointments: loadAppointments
  };
}

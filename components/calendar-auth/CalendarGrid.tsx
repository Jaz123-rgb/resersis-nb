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
  createdAt?: string;
  updatedAt?: string;
  managementToken?: string;
}

interface CalendarGridProps {
  isDarkMode: boolean;
  days: (number | null)[];
  getAppointmentsForDay: (day: number) => Appointment[];
  currentMonth: Date;
  openAppointmentModal: (appointment: Appointment) => void;
}

export default function CalendarGrid({ isDarkMode, days, getAppointmentsForDay, currentMonth, openAppointmentModal }: CalendarGridProps) {
  // Agrupar días en semanas de 7
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={`${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <table className="w-full max-w-4xl mx-auto border-collapse">
        <thead>
          <tr className="text-center text-sm mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <th key={day} className={`font-medium p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return (
                    <td key={`empty-${weekIndex}-${dayIndex}`} className="text-center align-middle p-0">
                      <div className={`h-20 w-20 border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'}`} />
                    </td>
                  );
                }
                const dayAppointments = getAppointmentsForDay(day);
                const isToday = 
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear();
                const hasAppointments = dayAppointments.length > 0;
                
                return (
                  <td key={`day-${day}`} className="text-center align-middle p-2">
                    <button
                      onClick={() => hasAppointments && openAppointmentModal(dayAppointments[0])}
                      className={`h-25 w-25 border rounded flex flex-col items-start justify-between p-1 sm:p-2 transition-colors ${
                        isToday 
                          ? `border-blue-500 ${isDarkMode ? 'bg-black' : 'bg-white'}` 
                          : hasAppointments 
                            ? `border-green-400 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`
                            : `${isDarkMode ? 'border-gray-700 bg-black' : 'border-gray-300 bg-white'}`
                      } ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <span className={`text-xs sm:text-sm font-medium ${
                        isToday 
                          ? "text-blue-600" 
                          : hasAppointments 
                            ? "text-green-700 dark:text-green-400"
                            : `${isDarkMode ? 'text-white' : 'text-black'}`
                      }`}>
                        {day}
                      </span>
                      {hasAppointments && (
                        <div className="flex flex-col items-start w-full">
                          <div className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {dayAppointments.length} cita{dayAppointments.length > 1 ? 's' : ''}
                          </div>
                          {dayAppointments.slice(0, 2).map((appointment, index) => (
                            <div 
                              key={`${appointment.date}-${appointment.time}-${index}`} 
                              className={`text-xs truncate w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                              {appointment.time.slice(0, 5)} - {appointment.guestName}
                            </div>
                          ))}
                          {dayAppointments.length > 2 && (
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              +{dayAppointments.length - 2} más
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

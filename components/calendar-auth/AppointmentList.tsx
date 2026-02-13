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

interface AppointmentListProps {
  isDarkMode: boolean;
  appointments: Appointment[];
  currentMonth: Date;
  formatMonth: (date: Date) => string;
  openAppointmentModal: (appointment: Appointment) => void;
}

export default function AppointmentList({ isDarkMode, appointments, currentMonth, formatMonth, openAppointmentModal }: AppointmentListProps) {
  return (
    <div className={`${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-6`}>
      <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Citas de {formatMonth(currentMonth)}
      </h3>
      
      {appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === currentMonth.getMonth() && 
               aptDate.getFullYear() === currentMonth.getFullYear();
      }).length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className={`text-gray-500 mt-4 ${isDarkMode ? 'text-gray-400' : ''}`}>No hay citas programadas este mes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments
            .filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate.getMonth() === currentMonth.getMonth() && 
                     aptDate.getFullYear() === currentMonth.getFullYear();
            })
            .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
            .map(apt => (
              <div 
                key={apt.id} 
                className={`border rounded-lg p-4 transition-colors cursor-pointer ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => openAppointmentModal(apt)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{apt.guestName}</h4>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                    {apt.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
                
                <p className={`mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{apt.reason}</p>
                
                <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center space-x-1">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(apt.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{apt.time.slice(0, 5)}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

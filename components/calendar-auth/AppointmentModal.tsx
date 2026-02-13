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

interface AppointmentModalProps {
  isDarkMode: boolean;
  selectedAppointment: Appointment | null;
  closeModal: () => void;
}

export default function AppointmentModal({ isDarkMode, selectedAppointment, closeModal }: AppointmentModalProps) {
  if (!selectedAppointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
      <div className={`${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Detalles de la Cita</h3>
          <button 
            onClick={closeModal}
            className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Paciente</label>
            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedAppointment.guestName}</p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedAppointment.guestEmail}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fecha</label>
              <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>{new Date(selectedAppointment.date).toLocaleDateString('es-ES')}</p>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hora</label>
              <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedAppointment.time.slice(0, 5)}</p>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Motivo</label>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedAppointment.reason}</p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Estado</label>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
              {selectedAppointment.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
            </span>
          </div>

          {selectedAppointment.createdAt && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fecha de creación</label>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(selectedAppointment.createdAt).toLocaleString('es-ES')}
              </p>
            </div>
          )}
        </div>

        <div className={`flex justify-end p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <button 
            onClick={closeModal}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

interface CalendarHeaderProps {
  isDarkMode: boolean;
}

export default function CalendarHeader({ isDarkMode }: CalendarHeaderProps) {
  return (
    <div className="text-center">
      <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Mis Citas Programadas
      </h1>
      <p className={`text-gray-600 ${isDarkMode ? 'text-gray-400' : ''}`}>Gestiona y visualiza todas tus citas</p>
    </div>
  );
}

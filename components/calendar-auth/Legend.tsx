interface LegendProps {
  isDarkMode: boolean;
}

export default function Legend({ isDarkMode }: LegendProps) {
  return (
    <div className={`${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-6`}>
      <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Estado de las citas</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Citas programadas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded border border-blue-500"></div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Día actual</span>
        </div>
      </div>
    </div>
  );
}

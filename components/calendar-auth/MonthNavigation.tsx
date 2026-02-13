interface MonthNavigationProps {
  isDarkMode: boolean;
  currentMonth: Date;
  formatMonth: (date: Date) => string;
  navigateMonth: (direction: 'prev' | 'next') => void;
}

export default function MonthNavigation({ isDarkMode, currentMonth, formatMonth, navigateMonth }: MonthNavigationProps) {
  return (
    <div className="w-full mb-4 flex items-center justify-between">
      <button 
        onClick={() => navigateMonth('prev')}
        className={`px-3 py-1 rounded border transition-colors ${isDarkMode ? 'bg-black hover:bg-gray-900 border-gray-700 text-white' : 'bg-white hover:bg-gray-100 border-gray-300 text-black'}`}
      >
        ← Anterior
      </button>
      
      <h2 className={`text-2xl font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {formatMonth(currentMonth)}
      </h2>
      
      <button 
        onClick={() => navigateMonth('next')}
        className={`px-3 py-1 rounded border transition-colors ${isDarkMode ? 'bg-black hover:bg-gray-900 border-gray-700 text-white' : 'bg-white hover:bg-gray-100 border-gray-300 text-black'}`}
      >
        Siguiente →
      </button>
    </div>
  );
}

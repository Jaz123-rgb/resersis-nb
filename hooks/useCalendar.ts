import { useState, useMemo } from 'react';
import { getMonthInfo, isDateToday } from '../lib/utils/dateUtils';

export function useCalendar() {
  const now = new Date();
  const [displayedYear, setDisplayedYear] = useState(now.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(now.getMonth());

  const monthInfo = useMemo(() => 
    getMonthInfo(displayedYear, displayedMonth), 
    [displayedYear, displayedMonth]
  );

  const goPrevMonth = () => {
    setDisplayedMonth((m) => {
      if (m === 0) {
        setDisplayedYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goNextMonth = () => {
    setDisplayedMonth((m) => {
      if (m === 11) {
        setDisplayedYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const isToday = (day: number) => {
    return isDateToday(displayedYear, displayedMonth, day);
  };

  return {
    displayedYear,
    displayedMonth,
    ...monthInfo,
    goPrevMonth,
    goNextMonth,
    isToday,
    setDisplayedYear,
    setDisplayedMonth
  };
}

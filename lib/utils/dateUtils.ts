export function formatDateToISO(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function isDateToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

export function getMonthInfo(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const firstDayOfMonth = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDayOfMonth;

  return {
    firstDayOfMonth,
    daysInMonth,
    startWeekday
  };
}

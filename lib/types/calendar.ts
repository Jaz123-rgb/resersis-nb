export interface CalendarState {
  displayedYear: number;
  displayedMonth: number;
  loading: boolean;
  error: string | null;
}

export interface MonthInfo {
  firstDay: Date;
  lastDay: Date;
  startWeekday: number;
  daysInMonth: number;
}

export interface CalendarDay {
  day: number;
  isToday: boolean;
  hasAppointments: boolean;
  appointmentCount: number;
}

export interface CalendarConfig {
  locale: string;
  weekStartsOn: number; // 0 = Sunday, 1 = Monday
  maxAppointmentsDisplay: number;
}

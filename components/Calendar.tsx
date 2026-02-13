"use client";
import React from "react";
import { useCalendar } from "../hooks/useCalendar";
import { useAppointments } from "../hooks/useAppointments";
import { formatDateToISO } from "../lib/utils/dateUtils";
import { Appointment } from "../app/api/interface/ApointmentsInterface";
import DayAppointmentsModal from "./DayAppointmentsModal";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";

type Props = {
  onSelectDate: (isoDate: string) => void;
  refreshKey?: number;
};

export default function Calendar({ onSelectDate, refreshKey }: Props) {
  const {
    displayedYear,
    displayedMonth,
    goPrevMonth,
    goNextMonth,
    isToday,
    firstDayOfMonth,
    daysInMonth,
    startWeekday
  } = useCalendar();

  const {
    appointments,
    loading,
    getAppointmentsForDay,
    refreshAppointments
  } = useAppointments(displayedYear, displayedMonth, refreshKey);

  const [showDayModal, setShowDayModal] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedDayAppointments, setSelectedDayAppointments] = React.useState<Appointment[]>([]);

  const handleDayClick = (day: number) => {
    const dateString = formatDateToISO(displayedYear, displayedMonth, day);
    
    const dayAppointments = getAppointmentsForDay(day);
    
    if (dayAppointments.length > 0) {
      setSelectedDate(dateString);
      setSelectedDayAppointments(dayAppointments);
      setShowDayModal(true);
    } else {
      onSelectDate(dateString);
    }
  };

  const handleCreateAppointment = () => {
    setShowDayModal(false);
    onSelectDate(selectedDate);
  };

  return (
    <>
      <div className="w-full">
        <CalendarHeader
          displayedYear={displayedYear}
          displayedMonth={displayedMonth}
          loading={loading}
          onPrevMonth={goPrevMonth}
          onNextMonth={goNextMonth}
        />
        
        <CalendarGrid
          startWeekday={startWeekday}
          daysInMonth={daysInMonth}
          onDayClick={handleDayClick}
          getAppointmentsForDay={getAppointmentsForDay}
          isToday={isToday}
        />
      </div>

      <DayAppointmentsModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        date={selectedDate}
        appointments={selectedDayAppointments}
        onCreateAppointment={handleCreateAppointment}
      />
    </>
  );
}
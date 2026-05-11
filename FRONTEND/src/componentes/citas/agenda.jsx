import React from "react";
import AgendaHeader from './agenda/filtros';
import AgendaBody from './agenda/cuerpo';
import Calendario from './agenda/calendario';
import { useAgenda } from "./hook/useAgenda";

const Agenda = ({ onSelectCita, refreshKey }) => {
  const {
    showCalendar,
    setShowCalendar,
    currentWeek,
    setCurrentWeek,
    days,
    visibleAppointments,
    hours,
    weekRange,
    nextWeek,
    prevWeek
  } = useAgenda(refreshKey);

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans text-gray-700 dark:text-gray-200">
      
      <AgendaHeader
        currentWeek={currentWeek}
        weekRange={weekRange}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
        onToggleCalendar={() => setShowCalendar(!showCalendar)}
      />

      {showCalendar && (
        <div className="absolute top-20 right-4 z-50">
          <Calendario
            selectedDate={currentWeek}
            onSelectDate={(date) => {
              setCurrentWeek(date);
              setShowCalendar(false);
            }}
          />
        </div>
      )}

      <AgendaBody
        days={days}
        hours={hours}
        appointments={visibleAppointments}
        onSelectCita={onSelectCita}
      />
    </div>
  );
};

export default Agenda;
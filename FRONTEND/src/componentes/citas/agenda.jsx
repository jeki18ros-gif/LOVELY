import React, { useState } from "react";
import AgendaHeader from './agenda/filtros';
import AgendaBody from './agenda/cuerpo';
import Calendario from './agenda/calendario';

const Agenda = ({ onSelectCita }) => {
  // Datos configurables
  const days = [
    { day: 'Lun', date: '19' },
    { day: 'Mar', date: '20' },
    { day: 'Mié', date: '21' },
    { day: 'Jue', date: '22' },
    { day: 'Vie', date: '23' },
    { day: 'Sáb', date: '24' },
    { day: 'Dom', date: '25' },
  ];

  const hours = Array.from({ length: 13 }, (_, i) =>
    `${(i + 8).toString().padStart(2, '0')}:00`
  );
const [showCalendar, setShowCalendar] = useState(false);
  const appointments = [
    { day: 0, start: '09:00', end: '10:00', title: 'María López', color: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' },
    { day: 0, start: '11:00', end: '12:30', title: 'Ana García', color: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' },
    { day: 1, start: '10:00', end: '11:30', title: 'Carmen Ruiz', color: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans text-gray-700 dark:text-gray-200 transition-colors">
      <AgendaHeader 
        dateRange="Junio 2026"
        onToggleCalendar={() => setShowCalendar(!showCalendar)}dateRange="19 - 25 de mayo, 2025" />
      
      {showCalendar && (
        <div className="absolute right-0 mt-2 z-50">
          <Calendario />
        </div>
      )}
      <AgendaBody 
  days={days} 
  hours={hours} 
  appointments={appointments} 
  onSelectCita={onSelectCita}
/>
    </div>
  );
};

export default Agenda;
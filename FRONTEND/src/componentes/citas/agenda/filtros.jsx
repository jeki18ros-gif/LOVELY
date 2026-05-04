import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const AgendaHeader = ({ dateRange, onToggleCalendar }) => {
  return (
    <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <ChevronLeft size={18} />
        </button>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <ChevronRight size={18} />
        </button>

        <div className="px-4 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
          {dateRange}
        </div>
      </div>

      {/* BOTÓN CALENDARIO */}
      <button
        onClick={onToggleCalendar}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
      >
        <Calendar size={16} />
        Calendario
      </button>

    </div>
  );
};

export default AgendaHeader;
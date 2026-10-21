import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const Calendario = ({ selectedDate = new Date(), onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

  // Sincronizar estado sin usar useEffect (evita renderizados en cascada)
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    setCurrentDate(selectedDate);
  }

  // Garantizar que trabajamos con un objeto Date válido
  const validDate = currentDate instanceof Date && !isNaN(currentDate) ? currentDate : new Date();
  const validSelected = selectedDate instanceof Date && !isNaN(selectedDate) ? selectedDate : new Date();

  const year = validDate.getFullYear();
  const month = validDate.getMonth();

  const primerDia = new Date(year, month, 1).getDay();
  const diasEnMes = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dias = [];
  for (let i = 0; i < primerDia; i++) {
    dias.push(null);
  }
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md w-80 border border-gray-200 dark:border-gray-700">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="font-semibold">
          {MESES[month]} {year}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* DÍAS SEMANA */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
        {DIAS_SEMANA.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* DÍAS */}
      <div className="grid grid-cols-7 text-center text-sm gap-1">
        {dias.map((d, index) => {
          if (!d) {
            return <div key={`empty-${index}`} className="p-2" />;
          }

          const isSelected =
            validSelected.getDate() === d &&
            validSelected.getMonth() === month &&
            validSelected.getFullYear() === year;

          return (
            <button
              type="button"
              key={`day-${d}`}
              onClick={() => {
                onSelectDate?.(new Date(year, month, d));
              }}
              className={`p-2 rounded-lg transition font-medium ${
                isSelected
                  ? "bg-cyan-500 text-white"
                  : "hover:bg-cyan-100 dark:hover:bg-cyan-900"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendario;
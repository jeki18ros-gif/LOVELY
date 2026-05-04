import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth}>
          <ChevronLeft />
        </button>

        <h2 className="font-semibold">
          {meses[month]} {year}
        </h2>

        <button onClick={nextMonth}>
          <ChevronRight />
        </button>
      </div>

      {/* Días semana */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
        {diasSemana.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 text-center text-sm gap-1">
        {dias.map((d, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              d ? "hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" : ""
            }`}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;
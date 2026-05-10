import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Calendario = ({
  selectedDate,
  onSelectDate
}) => {

  const [currentDate, setCurrentDate] =
    useState(selectedDate);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  const diasSemana = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb"
  ];

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const primerDia =
    new Date(year, month, 1).getDay();

  const diasEnMes =
    new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const dias = [];

  for (let i = 0; i < primerDia; i++) {
    dias.push(null);
  }

  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i);
  }

  return (
    <div
      className="
        bg-white
        dark:bg-gray-800
        p-4
        rounded-xl
        shadow-md
        w-80
        border
        border-gray-200
        dark:border-gray-700
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">

        <button
          onClick={prevMonth}
          className="
            p-2
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-gray-700
          "
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="font-semibold">
          {meses[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="
            p-2
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-gray-700
          "
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* DÍAS SEMANA */}
      <div
        className="
          grid
          grid-cols-7
          text-center
          text-sm
          font-medium
          mb-2
        "
      >
        {diasSemana.map((d) => (
          <div key={d}>
            {d}
          </div>
        ))}
      </div>

      {/* DÍAS */}
      <div
        className="
          grid
          grid-cols-7
          text-center
          text-sm
          gap-1
        "
      >

        {dias.map((d, index) => {

          if (!d) {
            return (
              <div
                key={index}
                className="p-2"
              />
            );
          }

          const isSelected =
            selectedDate.getDate() === d &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

          return (
            <button
              key={index}

              onClick={() => {
                onSelectDate(
                  new Date(year, month, d)
                );
              }}

              className={`
                p-2
                rounded-lg
                transition
                font-medium

                ${
                  isSelected
                    ? `
                      bg-cyan-500
                      text-white
                    `
                    : `
                      hover:bg-cyan-100
                      dark:hover:bg-cyan-900
                    `
                }
              `}
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
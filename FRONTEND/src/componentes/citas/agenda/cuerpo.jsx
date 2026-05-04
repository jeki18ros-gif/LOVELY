import React from 'react';

const AgendaBody = ({ days, hours, appointments, onSelectCita }) => {
  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[1000px]">
        
        {/* Espacio vacío superior izquierdo */}
        <div className="sticky top-0 left-0 bg-white dark:bg-gray-800 border-b border-r dark:border-gray-700 z-20"></div>

        {/* Cabecera de Días */}
        {days.map((d, i) => (
          <div key={i} className="sticky top-0 bg-gray-50 dark:bg-gray-700 border-b border-r dark:border-gray-600 p-3 text-center z-10">
            <span className="text-gray-400 text-sm">{d.day}</span>
            <span className="block font-bold">{d.date}</span>
          </div>
        ))}

        {/* Filas de Horas */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Etiqueta de la Hora */}
            <div className="border-b border-r p-4 text-xs text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10">
              {hour}
            </div>

            {/* Celdas de contenido */}
            {days.map((_, dayIndex) => (
              <div key={dayIndex} className="border-b border-r relative h-20 hover:bg-gray-50 dark:hover:bg-gray-700">
                {appointments
  .filter(app => app.day === dayIndex && app.start === hour)
  .map((app, idx) => (
    <div
      key={idx}
      onClick={() => onSelectCita(app)}
      className={`absolute inset-x-1 top-1 p-2 rounded-lg border-l-4 z-0 cursor-pointer hover:scale-[1.02] transition ${app.color}`}
    >
                      <p className="text-[10px]">{app.start} - {app.end}</p>
                      <p className="font-bold text-xs truncate">{app.title}</p>
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AgendaBody;
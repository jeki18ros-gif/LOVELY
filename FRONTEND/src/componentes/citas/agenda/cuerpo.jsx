import React from 'react';

const AgendaBody = ({
  days,
  hours,
  appointments,
  onSelectCita
}) => {

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">

      <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[1000px]">

        {/* ESQUINA */}
        <div className="sticky top-0 left-0 bg-white dark:bg-gray-800 border-b border-r dark:border-gray-700 z-20" />

        {/* CABECERA DÍAS */}
        {days.map((day, i) => (
          <div
            key={i}
            className="
              sticky
              top-0
              bg-gray-50
              dark:bg-gray-700
              border-b
              border-r
              dark:border-gray-600
              p-3
              text-center
              z-10
            "
          >
            <span className="text-gray-400 text-sm">
              {day.day}
            </span>

            <span className="block font-bold">
              {day.date}
            </span>
          </div>
        ))}

        {/* HORAS */}
        {hours.map((hour) => {

          const hourNumber =
            Number(hour.split(':')[0]);

          return (
            <React.Fragment key={hour}>

              {/* ETIQUETA HORA */}
              <div
                className="
                  border-b
                  border-r
                  p-4
                  text-xs
                  text-gray-400
                  sticky
                  left-0
                  bg-white
                  dark:bg-gray-800
                  z-10
                "
              >
                {hour}
              </div>

              {/* COLUMNAS DÍA */}
              {days.map((day, dayIndex) => (

                <div
                  key={dayIndex}
                  className="
                    border-b
                    border-r
                    relative
                    h-20
                    hover:bg-gray-50
                    dark:hover:bg-gray-700
                  "
                >

                  {appointments
                    .filter(app => {

                      const appDate =
                        app.start;

                      const sameDay =
                        appDate.toDateString() ===
                        day.fullDate.toDateString();

                      const sameHour =
                        appDate.getHours() ===
                        hourNumber;

                      return sameDay && sameHour;
                    })

                    .map((app) => (

                      <div
                        key={app.id}
                        onClick={() =>
                          onSelectCita(app)
                        }
                        className={`
                          absolute
                          inset-x-1
                          top-1
                          p-2
                          rounded-lg
                          border-l-4
                          z-0
                          cursor-pointer
                          hover:scale-[1.02]
                          transition
                          ${app.color}
                        `}
                      >

                        <p className="text-[10px]">
                          {new Date(app.start)
                            .toLocaleTimeString(
                              'es-PE',
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )}

                          {' - '}

                          {new Date(app.end)
                            .toLocaleTimeString(
                              'es-PE',
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )}
                        </p>

                        <p className="font-bold text-xs truncate">
                          {app.title}
                        </p>

                      </div>
                    ))}

                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaBody;
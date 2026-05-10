import React, { useState } from "react";

import AgendaHeader from './agenda/filtros';
import AgendaBody from './agenda/cuerpo';
import Calendario from './agenda/calendario';
const Agenda = ({ onSelectCita }) => {

  /* =========================
     ESTADOS
  ========================= */

  const [showCalendar, setShowCalendar] =
    useState(false);
  const [currentWeek, setCurrentWeek] =
    useState(new Date());
  const [appointments, setAppointments] =
    useState([
      {
        id: 1,
        title: 'María López',
        start: '2026-05-19T09:00:00',
        end: '2026-05-19T10:30:00',
        color:
          'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
      },
      {
        id: 2,
        title: 'Ana García',
        start: '2026-05-20T11:00:00',
        end: '2026-05-20T12:00:00',
        color:
          'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'
      },
      {
        id: 3,
        title: 'Carmen Ruiz',
        start: '2026-05-22T15:00:00',
        end: '2026-05-22T16:30:00',
        color:
          'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
  }]);

  /* =========================
     GENERAR SEMANA
  ========================= */

  const getWeekDays = (date) => {
    const start = new Date(date);
    const day = start.getDay();

    const diff =
      start.getDate() -
      day +
      (day === 0 ? -6 : 1);
    start.setDate(diff);
    return Array.from(
      { length: 7 },
      (_, i) => {
        const d = new Date(start);

        d.setDate(
          start.getDate() + i);

        return {
          fullDate: d,
          day:
            d.toLocaleDateString(
              'es-PE',
              {
                weekday: 'short'}
            ),
          date: d.getDate()};});};

  /* =========================
     NAVEGAR SEMANAS
  ========================= */

  const nextWeek = () => {

    const next =
      new Date(currentWeek);

    next.setDate(
      next.getDate() + 7
    );

    setCurrentWeek(next);
  };

  const prevWeek = () => {

    const prev =
      new Date(currentWeek);

    prev.setDate(
      prev.getDate() - 7
    );

    setCurrentWeek(prev);
  };

  /* =========================
     FILTRAR CITAS
  ========================= */

  const days =
    getWeekDays(currentWeek);

  const visibleAppointments =
    appointments.filter(app => {

      const appDate =
        new Date(app.start);

      return days.some(day =>
        day.fullDate.toDateString() ===
        appDate.toDateString()
      );});

  /* =========================
     GENERAR HORAS
  ========================= */

  const generateHours = (
    appointments
  ) => {

    if (!appointments.length) {

      return Array.from(
        { length: 13 },
        (_, i) =>
          `${String(i + 8)
            .padStart(2, '0')}:00`
      );
    }

    const hours =
      appointments.flatMap(app => [

        new Date(app.start)
          .getHours(),

        new Date(app.end)
          .getHours()
      ]);

    const min = Math.max(
      Math.min(...hours) - 1,
      6
    );

    const max = Math.min(
      Math.max(...hours) + 2,
      23
    );

    return Array.from(
      { length: max - min + 1 },

      (_, i) =>
        `${String(min + i)
          .padStart(2, '0')}:00`
    );};
  const hours =
    generateHours(
      visibleAppointments
    );

  /* =========================
     RANGO DE SEMANA
  ========================= */
  const weekRange = `
    ${days[0].fullDate.toLocaleDateString(
      'es-PE',
      {
        day: 'numeric',
        month: 'short'
      })}

    -
    ${days[6].fullDate.toLocaleDateString(
      'es-PE',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}`;

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      className="
        relative
        flex
        flex-col
        h-screen
        bg-gray-50
        dark:bg-gray-900
        p-4
        font-sans
        text-gray-700
        dark:text-gray-200
        transition-colors
      ">
      {/* HEADER */}
      <AgendaHeader
        currentWeek={currentWeek}
        weekRange={weekRange}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
        onToggleCalendar={() =>
          setShowCalendar(
            !showCalendar)}/>
      {/* CALENDARIO */}
      {showCalendar && (
        <div
          className="
            absolute
            top-20
            right-4
            z-50
          ">
          <Calendario
            selectedDate={
         currentWeek
            }
            onSelectDate={(
              date) => {
              setCurrentWeek(date);
              setShowCalendar(
                false
              );}}
          />
        </div>
      )}
      {/* CUERPO */}
      <AgendaBody
        days={days}
        hours={hours}
        appointments={
          visibleAppointments
        }
        onSelectCita={
          onSelectCita}
      />
    </div>
  );
};

export default Agenda;
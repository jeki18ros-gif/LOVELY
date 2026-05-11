import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../lib/supabase";

export const useAgenda = (refreshKey) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  const colores = [
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  ];

  const obtenerColor = (hora) => {
    const h = parseInt(hora.split(":")[0]);
    if (h < 10) return colores[0];
    if (h < 12) return colores[1];
    if (h < 14) return colores[2];
    if (h < 16) return colores[3];
    if (h < 18) return colores[4];
    if (h < 20) return colores[5];
    return colores[6];
  };

  const obtenerCitas = async () => {
    const { data, error } = await supabase
      .from("citas")
      .select(`
        *,
        clientes:cliente_id (id, nombre),
        servicio:servicio_id (id, nombre)
      `)
      .order("fecha", { ascending: true });

    if (error) {
      console.error("Error citas:", error);
      return;
    }

    const citasFormateadas = data.map(cita => {
      const start = new Date(`${cita.fecha}T${cita.hora_inicio}`);
      const fin = new Date(start);
      fin.setMinutes(fin.getMinutes() + Number(cita.duracion_minutos));

      return {
        id: cita.id,
        title: cita.clientes?.nombre || "Cliente",
        service: cita.servicio?.nombre || "Servicio",
        start: start,
        end: fin,
        duration: cita.duracion_minutos,
        price: cita.precio,
        notes: cita.notas,
        status: cita.estado,
        color: obtenerColor(cita.hora_inicio)
      };
    });

    setAppointments(citasFormateadas);
  };

  useEffect(() => {
    obtenerCitas();
  }, [refreshKey]);

  const days = useMemo(() => {
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        fullDate: d,
        day: d.toLocaleDateString('es-PE', { weekday: 'short' }),
        date: d.getDate()
      };
    });
  }, [currentWeek]);

const visibleAppointments = useMemo(() => {
  return appointments.filter(app => {
    return days.some(day => {

      const dayString =
        day.fullDate.toDateString();

      const appString =
        app.start.toDateString();

      return dayString === appString;
    });
  });
}, [appointments, days]);

  const hours = useMemo(() => {
    if (!visibleAppointments.length) {
      return Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
    }
    const allHours = visibleAppointments.flatMap(app => [
      new Date(app.start).getHours(),
      new Date(app.end).getHours()
    ]);
    const min = Math.max(Math.min(...allHours) - 1, 6);
    const max = Math.min(Math.max(...allHours) + 2, 23);
    return Array.from({ length: max - min + 1 }, (_, i) => `${String(min + i).padStart(2, '0')}:00`);
  }, [visibleAppointments]);

  const weekRange = `${days[0].fullDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} - ${days[6].fullDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const nextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(prev);
  };

  return {
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
  };
};
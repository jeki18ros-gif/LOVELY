import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Scissors, 
  Clock, 
  DollarSign,
  Filter,
  RotateCcw
} from 'lucide-react';

export default function CitasHistory() {

  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const citas = [
    {
      id: 1,
      cliente: 'Carlos Pérez',
      servicio: 'Corte + Barba',
      fecha: '2024-05-04',
      hora: '10:30',
      profesional: 'Luis',
      monto: 45,
      metodo: 'Efectivo',
      estado: 'Realizada'
    },
    {
      id: 2,
      cliente: 'María López',
      servicio: 'Tinte Completo',
      fecha: '2024-05-03',
      hora: '14:00',
      profesional: 'Ana',
      monto: 120,
      metodo: 'Yape',
      estado: 'Cancelada'
    },
    {
      id: 3,
      cliente: 'Juan Torres',
      servicio: 'Corte',
      fecha: '2024-05-03',
      hora: '16:00',
      profesional: 'Luis',
      monto: 30,
      metodo: 'Tarjeta',
      estado: 'No asistió'
    },
    {
      id: 4,
      cliente: 'Lucía Ramos',
      servicio: 'Peinado',
      fecha: '2024-05-05',
      hora: '11:00',
      profesional: 'Ana',
      monto: 50,
      metodo: '-',
      estado: 'Pendiente'
    }
  ];

  const estadosColor = {
    'Realizada': 'bg-green-500/10 text-green-500',
    'Cancelada': 'bg-red-500/10 text-red-500',
    'Pendiente': 'bg-yellow-500/10 text-yellow-500',
    'No asistió': 'bg-gray-500/10 text-gray-400'
  };

  const citasFiltradas = filtroEstado === 'Todos'
    ? citas
    : citas.filter(c => c.estado === filtroEstado);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl uppercase tracking-widest">
          Historial de Citas <span className="text-[#D4AF37]">|</span>
        </h1>
      </header>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-4 mb-8 items-center border-b border-gray-200 dark:border-gray-800 pb-4">

        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Filter size={16} />
          <span className="text-xs uppercase">Filtrar:</span>
        </div>

        <select 
          value={filtroEstado}
          onChange={(e)=>setFiltroEstado(e.target.value)}
          className="bg-transparent text-xs uppercase"
        >
          <option>Todos</option>
          <option>Realizada</option>
          <option>Cancelada</option>
          <option>Pendiente</option>
          <option>No asistió</option>
        </select>

        <button 
          onClick={()=>setFiltroEstado('Todos')}
          className="ml-auto flex items-center gap-2 text-xs opacity-60 hover:opacity-100"
        >
          <RotateCcw size={14}/> Limpiar
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="p-4 text-xs uppercase">Cliente</th>
              <th className="p-4 text-xs uppercase">Servicio</th>
              <th className="p-4 text-xs uppercase">Fecha</th>
              <th className="p-4 text-xs uppercase">Hora</th>
              <th className="p-4 text-xs uppercase">Profesional</th>
              <th className="p-4 text-xs uppercase">Monto</th>
              <th className="p-4 text-xs uppercase">Método</th>
              <th className="p-4 text-xs uppercase">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {citasFiltradas.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">

                <td className="p-4 flex items-center gap-2">
                  <User size={14}/> {c.cliente}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <Scissors size={14}/> {c.servicio}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <Calendar size={14}/> {c.fecha}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <Clock size={14}/> {c.hora}
                </td>

                <td className="p-4">{c.profesional}</td>

                <td className="p-4 flex items-center gap-2 text-[#D4AF37] font-semibold">
                  <DollarSign size={14}/> S/ {c.monto}
                </td>

                <td className="p-4">{c.metodo}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase ${estadosColor[c.estado]}`}>
                    {c.estado}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {citasFiltradas.length === 0 && (
          <div className="p-6 text-center text-xs opacity-50">
            No hay citas con ese filtro
          </div>
        )}
      </div>

    </div>
  );
}
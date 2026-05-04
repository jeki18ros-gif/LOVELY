import React, { useState } from 'react';
import {
  FileText,
  Eye,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Filter,
  RotateCcw
} from 'lucide-react';

export default function VentasHistory() {

  const [filtroMetodo, setFiltroMetodo] = useState('Todos');

  const ventas = [
    {
      id: 1,
      cliente: 'Carlos Pérez',
      fecha: '2024-05-04 10:30',
      total: 85,
      metodo: 'Efectivo',
      usuario: 'Luis',
      estado: 'Pagado',
      pdf: '#'
    },
    {
      id: 2,
      cliente: 'María López',
      fecha: '2024-05-04 12:10',
      total: 120,
      metodo: 'Yape',
      usuario: 'Ana',
      estado: 'Pagado',
      pdf: '#'
    },
    {
      id: 3,
      cliente: 'Juan Torres',
      fecha: '2024-05-04 14:00',
      total: 45,
      metodo: 'Tarjeta',
      usuario: 'Luis',
      estado: 'Anulado',
      pdf: '#'
    }
  ];

  const estadoColor = {
    Pagado: 'text-green-500 bg-green-500/10',
    Anulado: 'text-red-500 bg-red-500/10'
  };

  const data = filtroMetodo === 'Todos'
    ? ventas
    : ventas.filter(v => v.metodo === filtroMetodo);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl uppercase tracking-widest">
          Historial de Ventas <span className="text-[#D4AF37]">|</span>
        </h1>
      </header>

      {/* FILTROS */}
      <div className="flex gap-4 items-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">

        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Filter size={16}/>
          <span className="text-xs uppercase">Filtrar:</span>
        </div>

        <select
          value={filtroMetodo}
          onChange={(e)=>setFiltroMetodo(e.target.value)}
          className="bg-transparent text-xs uppercase"
        >
          <option>Todos</option>
          <option>Efectivo</option>
          <option>Yape</option>
          <option>Tarjeta</option>
        </select>

        <button
          onClick={()=>setFiltroMetodo('Todos')}
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
              <th className="p-4 text-xs uppercase">Fecha</th>
              <th className="p-4 text-xs uppercase">Total</th>
              <th className="p-4 text-xs uppercase">Método</th>
              <th className="p-4 text-xs uppercase">Usuario</th>
              <th className="p-4 text-xs uppercase">Estado</th>
              <th className="p-4 text-xs uppercase text-center">PDF</th>
              <th className="p-4 text-xs uppercase text-center">Detalle</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">

                <td className="p-4 flex items-center gap-2">
                  <User size={14}/> {v.cliente}
                </td>

                <td className="p-4 flex items-center gap-2 text-xs opacity-70">
                  <Calendar size={14}/> {v.fecha}
                </td>

                <td className="p-4 flex items-center gap-2 text-[#D4AF37] font-semibold">
                  <DollarSign size={14}/> S/ {v.total}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <CreditCard size={14}/> {v.metodo}
                </td>

                <td className="p-4">{v.usuario}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] rounded-full ${estadoColor[v.estado]}`}>
                    {v.estado}
                  </span>
                </td>

                {/* PDF */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => window.open(v.pdf, '_blank')}
                    className="text-[#D4AF37] hover:scale-110 transition"
                  >
                    <FileText size={18}/>
                  </button>
                </td>

                {/* VER DETALLE */}
                <td className="p-4 text-center">
                  <button className="hover:text-[#D4AF37] transition">
                    <Eye size={18}/>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="p-6 text-center text-xs opacity-50">
            No hay ventas registradas
          </div>
        )}
      </div>

    </div>
  );
}
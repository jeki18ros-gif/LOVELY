import React, { useState } from 'react';
import {
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Filter,
  RotateCcw,
  User,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function FinanzasHistory() {

  const [filtroTipo, setFiltroTipo] = useState('Todos');

  const movimientos = [
    {
      id: 1,
      tipo: 'Ingreso',
      descripcion: 'Corte + Barba',
      origen: 'Cita #102',
      metodo: 'Efectivo',
      monto: 45,
      usuario: 'Luis',
      fecha: '2024-05-04 10:30'
    },
    {
      id: 2,
      tipo: 'Egreso',
      descripcion: 'Compra de productos',
      origen: 'Manual',
      metodo: 'Efectivo',
      monto: 120,
      usuario: 'Admin',
      fecha: '2024-05-04 12:00'
    },
    {
      id: 3,
      tipo: 'Ingreso',
      descripcion: 'Venta Shampoo',
      origen: 'Producto',
      metodo: 'Yape',
      monto: 35,
      usuario: 'Ana',
      fecha: '2024-05-04 13:20'
    },
    {
      id: 4,
      tipo: 'Ajuste',
      descripcion: 'Corrección de caja',
      origen: 'Sistema',
      metodo: '-',
      monto: -10,
      usuario: 'Admin',
      fecha: '2024-05-04 21:00'
    }
  ];

  const colores = {
    Ingreso: 'text-green-500 bg-green-500/10',
    Egreso: 'text-red-500 bg-red-500/10',
    Ajuste: 'text-yellow-500 bg-yellow-500/10'
  };

  const iconos = {
    Ingreso: ArrowUpCircle,
    Egreso: ArrowDownCircle,
    Ajuste: Repeat
  };

  const dataFiltrada = filtroTipo === 'Todos'
    ? movimientos
    : movimientos.filter(m => m.tipo === filtroTipo);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl uppercase tracking-widest">
          Historial Financiero <span className="text-[#D4AF37]">|</span>
        </h1>
      </header>

      {/* FILTROS */}
      <div className="flex gap-4 items-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">

        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Filter size={16} />
          <span className="text-xs uppercase">Filtrar:</span>
        </div>

        <select
          value={filtroTipo}
          onChange={(e)=>setFiltroTipo(e.target.value)}
          className="bg-transparent text-xs uppercase"
        >
          <option>Todos</option>
          <option>Ingreso</option>
          <option>Egreso</option>
          <option>Ajuste</option>
        </select>

        <button
          onClick={()=>setFiltroTipo('Todos')}
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
              <th className="p-4 text-xs uppercase">Tipo</th>
              <th className="p-4 text-xs uppercase">Descripción</th>
              <th className="p-4 text-xs uppercase">Origen</th>
              <th className="p-4 text-xs uppercase">Método</th>
              <th className="p-4 text-xs uppercase">Monto</th>
              <th className="p-4 text-xs uppercase">Usuario</th>
              <th className="p-4 text-xs uppercase">Fecha</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {dataFiltrada.map(m => {
              const Icon = iconos[m.tipo];
              return (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">

                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] rounded-full flex items-center gap-1 w-fit ${colores[m.tipo]}`}>
                      <Icon size={12}/> {m.tipo}
                    </span>
                  </td>

                  <td className="p-4">{m.descripcion}</td>
                  <td className="p-4 opacity-60">{m.origen}</td>
                  <td className="p-4">{m.metodo}</td>

                  <td className={`p-4 font-semibold ${m.tipo === 'Ingreso' ? 'text-green-500' : m.tipo === 'Egreso' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {m.tipo === 'Egreso' ? '-' : ''} S/ {m.monto}
                  </td>

                  <td className="p-4 flex items-center gap-2">
                    <User size={14}/> {m.usuario}
                  </td>

                  <td className="p-4 text-xs opacity-60">{m.fecha}</td>

                </tr>
              );
            })}
          </tbody>
        </table>

        {dataFiltrada.length === 0 && (
          <div className="p-6 text-center text-xs opacity-50">
            No hay movimientos
          </div>
        )}
              {/*  NUEVA SECCIÓN: HISTORIAL */}
              <div className="mt-12 bg-white dark:bg-[#141414] border dark:border-gray-800">
        
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between">
                  <h3 className="text-xs uppercase tracking-widest">Último Cierre de Caja</h3>
                  <span className="text-[10px] opacity-50">Registro reciente</span>
                </div>
        
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                    <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Hora</th>
                      <th className="p-3">Usuario</th>
                      <th className="p-3">Ingresos</th>
                      <th className="p-3">Egresos</th>
                      <th className="p-3">Diferencia</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
        
                  <tbody>
                    <tr className="border-t border-gray-200 dark:border-gray-800">
                      <td className="p-3">2024-05-03</td>
                      <td className="p-3">22:15</td>
                      <td className="p-3">Admin</td>
                      <td className="p-3">S/ 1200</td>
                      <td className="p-3">S/ 300</td>
                      <td className="p-3 text-green-500">0.00</td>
                      <td className="p-3 text-green-500">Cuadrado</td>
                    </tr>
                  </tbody>
                </table>
        
                {/* paginacion */}
                <div className="flex justify-end gap-2 p-3">
                  <ChevronLeft size={18}/>
                  <ChevronRight size={18}/>
                </div>
              </div>
      </div>

    </div>
  );
}
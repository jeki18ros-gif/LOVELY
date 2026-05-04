import React, { useState } from 'react';
import {
  Package,
  Scissors,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  User
} from 'lucide-react';

export default function MovimientosHistory() {

  const [tipoVista, setTipoVista] = useState('Productos');

  const movimientos = [
    {
      id: 1,
      tipo: 'Producto',
      accion: 'Editado',
      nombre: 'Shampoo Premium',
      usuario: 'Admin',
      fecha: '2024-05-04 12:30',
      actual: { precio: 35 },
      anterior: { precio: 30 }
    },
    {
      id: 2,
      tipo: 'Servicio',
      accion: 'Eliminado',
      nombre: 'Corte Clásico',
      usuario: 'Luis',
      fecha: '2024-05-04 11:00',
      actual: null,
      anterior: { precio: 25 }
    },
    {
      id: 3,
      tipo: 'Producto',
      accion: 'Creado',
      nombre: 'Gel Fijador',
      usuario: 'Ana',
      fecha: '2024-05-04 10:00',
      actual: { precio: 20 },
      anterior: null
    }
  ];

  const accionesStyle = {
    Creado: 'text-green-500 bg-green-500/10',
    Editado: 'text-yellow-500 bg-yellow-500/10',
    Eliminado: 'text-red-500 bg-red-500/10'
  };

  const iconos = {
    Creado: Plus,
    Editado: Pencil,
    Eliminado: Trash2
  };

  const data = movimientos.filter(m => m.tipo === tipoVista.slice(0, -1));

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl uppercase tracking-widest">
          Movimientos <span className="text-[#D4AF37]">|</span>
        </h1>
      </header>

      {/* SWITCH PRODUCTOS / SERVICIOS */}
      <div className="flex gap-4 mb-6">

        {['Productos','Servicios'].map(v => (
          <button
            key={v}
            onClick={()=>setTipoVista(v)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border ${
              tipoVista === v 
                ? 'bg-[#D4AF37] text-black' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            {v === 'Productos' ? <Package size={14}/> : <Scissors size={14}/>}
            <span className="ml-2">{v}</span>
          </button>
        ))}

      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="p-4 text-xs uppercase">Acción</th>
              <th className="p-4 text-xs uppercase">Nombre</th>
              <th className="p-4 text-xs uppercase">Cambio</th>
              <th className="p-4 text-xs uppercase">Usuario</th>
              <th className="p-4 text-xs uppercase">Fecha</th>
              <th className="p-4 text-xs uppercase">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map(m => {
              const Icon = iconos[m.accion];

              return (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">

                  {/* tipo accion */}
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] rounded-full flex items-center gap-1 w-fit ${accionesStyle[m.accion]}`}>
                      <Icon size={12}/> {m.accion}
                    </span>
                  </td>

                  {/* nombre */}
                  <td className="p-4">{m.nombre}</td>

                  {/* comparacion */}
                  <td className="p-4 text-xs">
                    {m.anterior && m.actual ? (
                      <div>
                        <span className="text-red-400 line-through">
                          S/ {m.anterior.precio}
                        </span>
                        <span className="ml-2 text-green-400">
                          → S/ {m.actual.precio}
                        </span>
                      </div>
                    ) : m.accion === 'Creado' ? (
                      <span className="text-green-400">
                        Nuevo: S/ {m.actual?.precio}
                      </span>
                    ) : (
                      <span className="text-red-400">
                        Eliminado (S/ {m.anterior?.precio})
                      </span>
                    )}
                  </td>

                  {/* usuario */}
                  <td className="p-4 flex items-center gap-2">
                    <User size={14}/> {m.usuario}
                  </td>

                  {/* fecha */}
                  <td className="p-4 text-xs opacity-60">
                    {m.fecha}
                  </td>

                  {/* restaurar */}
                  <td className="p-4">
                    {(m.accion === 'Editado' || m.accion === 'Eliminado') && (
                      <button className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline">
                        <RotateCcw size={14}/> Restaurar
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="p-6 text-center text-xs opacity-50">
            No hay movimientos
          </div>
        )}
      </div>

    </div>
  );
}
import React from 'react';
import { Scissors, Search, ChevronDown, Beaker, Brush, Droplets } from 'lucide-react';

const ServiceList = () => {
  const servicios = [
    { id: 1, nombre: 'Corte de cabello', tiempo: '30 min', precio: '20.00', Icono: Scissors },
    { id: 2, nombre: 'Tinte completo', tiempo: '60 min', precio: '50.00', Icono: Beaker },
    { id: 3, nombre: 'Mechas', tiempo: '90 min', precio: '40.00', Icono: Brush },
    { id: 4, nombre: 'Cepillado', tiempo: '20 min', precio: '15.00', Icono: Brush },
    { id: 5, nombre: 'Tratamiento capilar', tiempo: '45 min', precio: '25.00', Icono: Droplets },
  ];

  return (
    <div className="max-w-md p-6 rounded-xl bg-white dark:bg-[#121212] text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-zinc-800 transition-colors duration-200">
      
      {/* Header Sección */}
      <div className="flex items-center gap-2 mb-6">
        <Scissors className="text-purple-400 dark:text-purple-500" size={20} />
        <h2 className="text-sm font-bold tracking-widest uppercase">Servicios</h2>
      </div>

      {/* Buscador y Filtro */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Buscar servicios..." 
            className="w-full bg-gray-100 dark:bg-zinc-900 border-none rounded-lg py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-900 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-zinc-800 transition-colors">
          Categorías
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Lista de Items */}
      <div className="space-y-5">
        {servicios.map((serv) => (
          <div key={serv.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {/* Icono de servicio (Avatar circular púrpura) */}
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-md">
                <serv.Icono size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">{serv.nombre}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{serv.tiempo}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">S/ {serv.precio}</span>
              
              {/* Selector de Cantidad */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-zinc-800 transition-colors">
                <span>1</span>
                <ChevronDown size={12} className="text-gray-500" />
              </div>

              {/* Checkbox Estilo Ámbar */}
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-5 h-5 rounded border-gray-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-800 transition-all cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
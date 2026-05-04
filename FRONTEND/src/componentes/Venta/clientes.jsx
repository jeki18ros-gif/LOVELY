import React from 'react';
import { User, Plus, Search, UserMinus, X } from 'lucide-react';

const ClientCard = () => {
  return (
    <div className="max-w-md p-6 rounded-xl bg-[#121212] dark:bg-[#121212] bg-white text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-zinc-800 transition-colors duration-200">
      
      {/* Header: Título y Botón Nuevo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="text-amber-500" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Cliente</h2>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors text-xs font-medium">
          <Plus size={14} />
          Nuevo cliente
        </button>
      </div>

      {/* Input de Búsqueda */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Buscar por nombre o teléfono..." 
          className="w-full bg-gray-100 dark:bg-zinc-900 border-none rounded-lg py-2.5 pl-4 pr-10 text-sm focus:ring-1 focus:ring-purple-500 outline-none transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
          <UserMinus size={18} />
        </div>
      </div>

      {/* Información del Cliente Seleccionado */}
      <div className="flex items-start justify-between mb-8 group">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold">Luisa Gonzales</h3>
            <span className="bg-purple-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white">
              Frecuente
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm tracking-wide">987 654 321</p>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Separador sutil */}
      <div className="border-t border-gray-100 dark:border-zinc-800/50 mb-6"></div>

      {/* Historial Reciente */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Historial reciente:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 rounded-md text-xs font-medium">
            Tinte completo
          </span>
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 rounded-md text-xs font-medium">
            Corte de cabello
          </span>
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 rounded-md text-xs font-medium">
            +3 más
          </span>
        </div>
      </div>

    </div>
  );
};

export default ClientCard;
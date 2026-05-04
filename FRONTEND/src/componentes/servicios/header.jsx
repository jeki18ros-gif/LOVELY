import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const ServicesHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121212] p-4 rounded-t-xl border-x border-t border-gray-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        {/* Título de la Sección */}
        <div className="flex items-center gap-2">
          <ClipboardList className="text-gray-400" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase dark:text-gray-200">
            Servicios
          </h2>
        </div>

        {/* Botón Nuevo Servicio */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-xs"
        >
          <Plus size={16} className="text-amber-500" />
          <span>Nuevo servicio</span>
        </button>

      </div>
    </div>
  );
};

export default ServicesHeader;
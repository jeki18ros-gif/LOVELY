import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const ServicesHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121212] p-5 rounded-t-3xl border-x border-t border-amber-500/20 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        {/* TÍTULO */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ClipboardList className="text-amber-600 dark:text-amber-400" size={20} />
          </div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-black dark:text-gray-200">
            Módulo de Servicios
          </h2>
        </div>

        {/* BOTÓN NUEVO SERVICIO */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs shadow-lg shadow-amber-500/10"
        >
          <Plus size={16} className="text-black stroke-[3]" />
          <span>Nuevo servicio</span>
        </button>

      </div>
    </div>
  );
};

export default ServicesHeader;
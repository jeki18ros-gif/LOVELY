import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const ClientesHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121212] p-5 rounded-t-3xl border-x border-t border-amber-500/20 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ClipboardList className="text-amber-600 dark:text-amber-400" size={18} />
          </div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-gray-200">
            Gestión de Clientes
          </h2>
        </div>

        {/* BOTÓN NUEVO CLIENTE: Fondo dorado semitransparente que se rellena al hacer hover */}
        <button 
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black dark:hover:text-black transition-all duration-200 font-bold text-xs uppercase tracking-wider shadow-sm"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>Nuevo Cliente</span>
        </button>

      </div>
    </div>
  );
};

export default ClientesHeader;
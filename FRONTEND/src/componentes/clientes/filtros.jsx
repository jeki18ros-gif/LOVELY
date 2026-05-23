import React from 'react';
import { Search, Clock, Box, RotateCcw } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', frecuencia: '', visitas: '' });
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-4 p-5 border-x border-b border-gray-200 dark:border-amber-500/20 bg-white dark:bg-[#121212] transition-all duration-300">
      
      {/* Input de Búsqueda de Lujo */}
      <div className="relative flex-grow max-w-xs group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-amber-500 transition-colors">
          <Search size={18} />
        </span>
        <input 
          name="search"
          value={filters.search}
          onChange={handleChange}
          type="text" 
          placeholder="Buscar por nombre o teléfono..." 
          className="w-full bg-transparent text-sm text-black dark:text-white border border-gray-200 dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-amber-500 dark:focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
        />
      </div>

      {/* Select Frecuencia */}
      <div className="relative group">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
        <select
          name="frecuencia"
          value={filters.frecuencia}
          onChange={handleChange}
          className="appearance-none text-sm text-black dark:text-zinc-200 pl-10 pr-10 py-2.5 bg-white dark:bg-[#161616] border border-gray-200 dark:border-zinc-800 rounded-xl outline-none cursor-pointer focus:border-amber-500 dark:focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
        >
          <option value="" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Frecuencia</option>
          <option value="Nuevo" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Nuevo</option>
          <option value="Regular" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Regular</option>
          <option value="Frecuente" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Frecuente</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-gray-400 dark:border-zinc-600 group-focus-within:border-amber-500 rotate-45 transition-colors" />
      </div>

      {/* Select Visitas */}
      <div className="relative group">
        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
        <select
          name="visitas"
          value={filters.visitas}
          onChange={handleChange}
          className="appearance-none text-sm text-black dark:text-zinc-200 pl-10 pr-10 py-2.5 bg-white dark:bg-[#161616] border border-gray-200 dark:border-zinc-800 rounded-xl outline-none cursor-pointer focus:border-amber-500 dark:focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
        >
          <option value="" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Visitas</option>
          <option value="0-5" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Pocas (0-5)</option>
          <option value="5-15" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Regular (5-15)</option>
          <option value="15-25" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Frecuente (15-25)</option>
          <option value="25+" className="bg-white text-black dark:bg-[#161616] dark:text-zinc-200">Más de 25</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-gray-400 dark:border-zinc-600 group-focus-within:border-amber-500 rotate-45 transition-colors" />
      </div>

      {/* Botón Limpiar Estilizado */}
      <button 
        onClick={handleReset}
        className="flex items-center gap-2 px-4 py-2.5 ml-auto border border-amber-500/30 dark:border-amber-500/20 rounded-xl text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 bg-amber-500/[0.04] dark:bg-amber-500/[0.02] hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-black transition-all duration-200 shadow-sm"
      >
        <RotateCcw size={14} className="stroke-[2.5]" />
        <span>Limpiar</span>
      </button>
    </div>
  );
};

export default FilterBar;
import React from 'react';
import { Search, Clock, Box, RotateCcw } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
  // Manejador genérico para cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', frecuencia: '', visitas: '' });
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-zinc-800">
      
      {/* Input de Búsqueda */}
      <div className="relative flex-grow max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        <input 
          name="search"
          value={filters.search}
          onChange={handleChange}
          type="text" 
          placeholder="Buscar por nombre o telefono..." 
          className="w-full bg-transparent border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* Select Frecuencia */}
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select
          name="frecuencia"
          value={filters.frecuencia}
          onChange={handleChange}
          className="appearance-none pl-10 pr-8 py-2.5 text-sm bg-transparent border border-gray-200 dark:border-zinc-700 rounded-lg outline-none cursor-pointer focus:border-amber-500"
        >
          <option value="">Frecuencia</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Regular">Regular</option>
          <option value="Frecuente">Frecuente</option>
        </select>
      </div>

      {/* Select Visitas */}
      <div className="relative">
        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select
          name="visitas"
          value={filters.visitas}
          onChange={handleChange}
          className="appearance-none pl-10 pr-8 py-2.5 text-sm bg-transparent border border-gray-200 dark:border-zinc-700 rounded-lg outline-none cursor-pointer focus:border-amber-500"
        >
          <option value="">Visitas</option>
          <option value="0-5">Pocas (0-5)</option>
          <option value="5-15">Regular (5-15)</option>
          <option value="15-25">Frecuente (15-25)</option>
          <option value="25+">Más de 25</option>
        </select>
      </div>

      {/* Botón Limpiar */}
      <button 
        onClick={handleReset}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors">
        <RotateCcw size={18} />
        <span>Limpiar</span>
      </button>
    </div>
  );
};

export default FilterBar;
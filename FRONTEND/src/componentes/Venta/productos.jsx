import React from 'react';
import { ShoppingBag, Search, ChevronDown, Sparkles } from 'lucide-react';

const ProductList = () => {
  const productos = [
    { id: 1, nombre: 'Shampoo hidratante', precio: '25.00' },
    { id: 2, nombre: 'Acondicionador', precio: '20.00' },
    { id: 3, nombre: 'Ampolla capilar', precio: '15.00' },
    { id: 4, nombre: 'Gel fijador', precio: '18.00' },
  ];

  return (
    <div className="max-w-md p-6 rounded-xl bg-white dark:bg-[#121212] text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-zinc-800 transition-colors duration-200">
      
      {/* Header Sección */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="text-pink-400 dark:text-pink-500" size={20} />
        <h2 className="text-sm font-bold tracking-widest uppercase">Productos</h2>
      </div>

      {/* Buscador y Filtro */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="w-full bg-gray-100 dark:bg-zinc-900 border-none rounded-lg py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-900 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-zinc-800 transition-colors">
          Categorías
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Lista de Items */}
      <div className="space-y-4">
        {productos.map((prod) => (
          <div key={prod.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {/* Icono de producto (Avatar circular verde) */}
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-inner">
                <Sparkles size={18} />
              </div>
              <span className="text-sm font-medium">{prod.nombre}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">S/ {prod.precio}</span>
              
              {/* Selector de Cantidad */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-zinc-800 transition-colors">
                <span>1</span>
                <ChevronDown size={12} className="text-gray-500" />
              </div>

              {/* Checkbox Personalizado Estilo Ámbar */}
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

export default ProductList;
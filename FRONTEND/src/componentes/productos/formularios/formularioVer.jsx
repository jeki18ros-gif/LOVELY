import React from "react";
import { X, Calendar, Tag, Clock, DollarSign } from "lucide-react";

export default function FormularioVer({ isOpen, onClose, producto }) {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl p-6 bg-white dark:bg-[#0f0f0f] border border-blue-500/30 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-500">Detalles del Producto</h2>
          <button onClick={onClose}><X className="text-gray-500 hover:text-blue-500" /></button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
            <Tag className="text-blue-500" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Nombre del Producto</p>
              <p className="text-gray-800 dark:text-gray-200">{producto.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
              <p className="text-xs text-gray-500 font-bold uppercase">Precio</p>
              <p className="text-lg font-semibold text-green-500">{producto.price}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
              <p className="text-xs text-gray-500 font-bold uppercase">Stock</p>
              <p className="text-gray-800 dark:text-gray-200">{producto.stock} unidades</p>
            </div>
          </div>

          <div className="p-3 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-2"><Calendar size={14}/> Fecha Registro:</span>
              <span className="text-gray-400">02/05/2026</span> 
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ID de Sistema:</span>
              <span className="text-gray-400">#PROD-{producto.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { 
  ScrollText, Trash2, Info, Scissors, Beaker, 
  Sparkles, Plus, X, ChevronDown 
} from 'lucide-react';

const SaleDetail = () => {
  const items = [
    { id: 1, nombre: 'Corte de cabello', tipo: 'Servicio', duracion: '30 min', precio: 20, cant: 1, total: 20, icon: Scissors, color: 'bg-purple-600' },
    { id: 2, nombre: 'Tinte completo', tipo: 'Servicio', duracion: '60 min', precio: 50, cant: 1, total: 50, icon: Beaker, color: 'bg-purple-600' },
    { id: 3, nombre: 'Shampoo hidratante', tipo: 'Producto', duracion: '-', precio: 25, cant: 2, total: 50, icon: Sparkles, color: 'bg-green-600' },
    { id: 4, nombre: 'Ampolla capilar', tipo: 'Producto', duracion: '-', precio: 15, cant: 1, total: 15, icon: Sparkles, color: 'bg-green-600' },
  ];

  return (
    <div className="w-full max-w-4xl p-6 rounded-xl bg-white dark:bg-[#121212] text-gray-800 dark:text-white shadow-2xl border border-gray-200 dark:border-zinc-800 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="text-gray-400" size={22} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Detalle de la venta</h2>
        </div>
        <button className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm transition-colors">
          <Trash2 size={16} />
          Vaciar todo
        </button>
      </div>

      {/* Alerta Informativa */}
      <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/50 p-3 rounded-lg mb-6 border border-zinc-200 dark:border-zinc-800">
        <Info size={18} className="text-sky-500" />
        <p className="text-sm text-gray-400">Agrega servicios y productos para construir la venta</p>
      </div>

      {/* Tabla de Items */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm mb-6">
          <thead>
            <tr className="text-gray-500 border-b border-zinc-800/50">
              <th className="pb-4 font-medium">Item</th>
              <th className="pb-4 font-medium text-center">Duración</th>
              <th className="pb-4 font-medium text-center">Precio</th>
              <th className="pb-4 font-medium text-center">Cant.</th>
              <th className="pb-4 font-medium text-center">Total</th>
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {items.map((item) => (
              <tr key={item.id} className="group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white`}>
                      <item.icon size={14} />
                    </div>
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-xs text-gray-500">{item.tipo}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center text-gray-400">{item.duracion}</td>
                <td className="py-4 text-center text-gray-400">S/ {item.precio.toFixed(2)}</td>
                <td className="py-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-md border border-transparent dark:border-zinc-800">
                    {item.cant} <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </td>
                <td className="py-4 text-center font-medium">S/ {item.total.toFixed(2)}</td>
                <td className="py-4 text-right">
                  <button className="text-gray-600 hover:text-white"><X size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: Notas, Descuento y Totales */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t border-zinc-800/50">
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-sm text-gray-400 hover:bg-zinc-800 transition-colors border border-transparent dark:border-zinc-800">
            <Plus size={16} />
            Agregar nota a la venta
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Descuento</span>
            <div className="flex bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
              <button className="px-3 py-1 text-xs font-bold text-gray-500 hover:bg-zinc-800">%</button>
              <button className="px-3 py-1 text-xs font-bold bg-amber-500/20 text-amber-500 border-l border-zinc-800">S/</button>
            </div>
          </div>
        </div>

        {/* Cuadro de Totales */}
        <div className="w-full md:w-72 bg-zinc-100 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span>S/ 135.00</span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-gray-400">Descuento</span>
            <span className="text-green-500 font-medium">- S/ 10.00</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <span className="text-amber-500 font-bold text-lg italic">TOTAL</span>
            <span className="text-amber-500 text-2xl font-bold tracking-tight">S/ 125.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
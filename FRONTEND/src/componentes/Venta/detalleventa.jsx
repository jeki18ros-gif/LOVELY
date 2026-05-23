import React from 'react';
import { ScrollText, Trash2, Sparkles, X } from 'lucide-react';

const SaleDetail = ({
  cliente,
  clienteAnonimo,
  productos,
  servicios,
  setProductos,
  setServicios,
  descuentoTipo,
  setDescuentoTipo,
  descuentoValor,
  setDescuentoValor,
  subtotal,
  descuento,
  total
}) => {

  const items = [...productos, ...servicios];

  const cambiarCantidad = (id, tipo, cantidad) => {
    if (cantidad < 1) return;

    if (tipo === 'Producto') {
      // 1. Buscamos el producto para conocer su stock límite
      const prodOriginal = productos.find(p => p.id === id);
      
      // Si el producto existe y la cantidad ingresada supera su stock, lo limitamos al máximo permitido
      if (prodOriginal && cantidad > prodOriginal.stock) {
        cantidad = prodOriginal.stock;
      }

      setProductos(productos.map(p => p.id === id ? { ...p, cantidad } : p));
    } else {
      // Los servicios no manejan stock físico, por lo que no llevan límite superior
      setServicios(servicios.map(s => s.id === id ? { ...s, cantidad } : s));
    }
  };

  const eliminarItem = (id, tipo) => {
    if (tipo === 'Producto') {
      setProductos(productos.filter(p => p.id !== id));
    } else {
      setServicios(servicios.filter(s => s.id !== id));
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 rounded-xl bg-white dark:bg-[#121212] shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <ScrollText size={22} className="text-amber-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Detalle de venta
          </h2>
        </div>
        <button
          onClick={() => { setProductos([]); setServicios([]); }}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Vaciar
        </button>
      </div>

      {/* CLIENTE */}
      <div className="mb-6 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 text-sm">
        <span className="text-gray-500 mr-2">Cliente:</span>
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {cliente ? cliente.nombre : clienteAnonimo ? 'Cliente manual' : 'Sin cliente seleccionado'}
        </span>
      </div>

      {/* CONTENEDOR CON SCROLL PARA LA TABLA */}
      <div className="relative overflow-y-auto max-h-[350px] mb-6 pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        <table className="w-full text-sm text-left border-collapse">
          {/* Header de tabla Sticky */}
          <thead className="sticky top-0 bg-white dark:bg-[#121212] z-10">
            <tr className="text-gray-500 border-b border-gray-100 dark:border-zinc-800">
              <th className="py-3 font-medium">Item</th>
              <th className="py-3 font-medium">Precio</th>
              <th className="py-3 font-medium">Cant.</th>
              <th className="py-3 font-medium">Total</th>
              <th className="py-3 w-8"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {items.map(item => {
              const totalItem = Number(item.precio) * item.cantidad;
              const esProducto = item.tipo === 'Producto';

              return (
                <tr key={`${item.tipo}-${item.id}`} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.nombre}</p>
                        <p className="text-xs text-gray-500">{item.tipo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600 dark:text-gray-400">S/ {item.precio}</td>
                  <td className="py-4">
                    <div className="flex flex-col items-start gap-1">
                      <input
                        type="number"
                        min="1"
                        // 2. Pasamos dinámicamente el valor máximo si corresponde a un producto física
                        max={esProducto ? item.stock : undefined}
                        value={item.cantidad}
                        onChange={(e) => cambiarCantidad(item.id, item.tipo, Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-amber-500 outline-none transition-all text-sm font-medium"
                      />
                      {/* 3. Recordatorio visual de stock máximo debajo del input */}
                      {esProducto && (
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                          Máx: {item.stock}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 font-semibold text-gray-800 dark:text-gray-200">S/ {totalItem.toFixed(2)}</td>
                  <td className="py-4">
                    <button
                      onClick={() => eliminarItem(item.id, item.tipo)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400 italic">
                  No hay items en la venta actual
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER (Descuento y Totales) - Siempre visible al final */}
      <div className="flex flex-col md:flex-row justify-between gap-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
        
        {/* DESCUENTO */}
        <div className="flex items-start gap-3">
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
            <select
              value={descuentoTipo}
              onChange={(e) => setDescuentoTipo(e.target.value)}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 outline-none text-sm"
            >
              <option value="monto">S/</option>
              <option value="porcentaje">%</option>
            </select>
            <input
              type="number"
              value={descuentoValor}
              onChange={(e) => setDescuentoValor(Number(e.target.value))}
              placeholder="Descuento"
              className="px-3 py-2 w-24 bg-white dark:bg-zinc-900 outline-none text-sm"
            />
          </div>
        </div>

        {/* TOTALES */}
        <div className="w-full md:w-72 rounded-xl p-5 bg-zinc-100 dark:bg-zinc-900 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Descuento</span>
            <span className="font-medium text-red-500">- S/ {descuento.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-zinc-700">
            <span className="text-gray-800 dark:text-white">TOTAL</span>
            <span className="text-amber-600 dark:text-amber-500">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
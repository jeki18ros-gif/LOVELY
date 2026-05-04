import React from 'react';
import { 
  Wallet, Banknote, Smartphone, CreditCard, 
  Layers 
} from 'lucide-react';

const PaymentModule = () => {
  return (
    <div className="
      max-w-2xl p-6 rounded-xl 
      bg-white text-gray-800 border border-gray-200
      dark:bg-[#121212] dark:text-white dark:border-zinc-800
      shadow-2xl transition-colors
    ">
      
      {/* Header Pago */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 self-start mb-4">
          <Wallet className="text-amber-500" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Pago</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total a pagar</p>
        <h1 className="text-4xl font-bold text-amber-500 tracking-tight">S/ 125.00</h1>
      </div>

      {/* Métodos de Pago */}
      <div className="mb-8">
        <h3 className="
          text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b
          text-amber-600/80 border-gray-200
          dark:border-zinc-800
        ">
          Método de Pago
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20">
            <Banknote size={18} /> Efectivo
          </button>

          <button className="
            flex items-center justify-center gap-2 py-3 px-4 rounded-lg
            bg-purple-100 text-purple-700 border border-purple-300
            hover:bg-purple-200
            dark:bg-[#3d1d4d] dark:text-purple-300 dark:border-purple-800/50 dark:hover:bg-[#4d2561]
            transition-colors
          ">
            <Smartphone size={18} /> Yape / Plin
          </button>

          <button className="
            flex items-center justify-center gap-2 py-3 px-4 rounded-lg
            bg-sky-100 text-sky-700 border border-sky-300
            hover:bg-sky-200
            dark:bg-[#0a2e4d] dark:text-sky-300 dark:border-sky-800/50 dark:hover:bg-[#0f3d66]
            transition-colors
          ">
            <CreditCard size={18} /> Tarjeta
          </button>
        </div>

        <button className="
          w-1/3 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm
          bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200
          dark:bg-zinc-800/50 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-800
          transition-colors
        ">
          <Layers size={16} /> Mixto
        </button>
      </div>

      {/* Calculadora de Cambio */}
      <div className="
        p-5 rounded-xl mb-6 border
        bg-gray-50 border-gray-200
        dark:bg-zinc-900/40 dark:border-zinc-800
        transition-colors
      ">
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="text-amber-500" size={16} />
          <span className="text-sm font-medium">Efectivo</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full">
            <label className="block text-xs text-gray-500 mb-2">Monto recibido</label>
            <div className="
              rounded-lg px-4 py-2.5 flex justify-between items-center border
              bg-white border-gray-300
              dark:bg-zinc-800/50 dark:border-zinc-700
            ">
              <span className="text-gray-500 dark:text-gray-400 text-sm">S/ 150.00</span>
            </div>
          </div>

          <div className="w-full flex justify-between items-end pb-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Cambio</span>
            <span className="text-3xl font-bold text-green-500">S/ 25.00</span>
          </div>
        </div>
      </div>

      {/* Referencia y Observaciones */}
      <div className="
        grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-xl border
        border-gray-200
        dark:border-zinc-800/50
      ">
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">
            Agregar referencia (opcional)
          </label>
          <input 
            type="text" 
            placeholder="Ej: Yape - 987 654 321" 
            className="
              w-full rounded-lg py-2.5 px-4 text-sm outline-none border
              bg-white border-gray-300
              focus:ring-1 focus:ring-amber-500
              dark:bg-zinc-900/50 dark:border-zinc-800
            "
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">
            Observaciones (opcional)
          </label>
          <textarea 
            rows="2"
            placeholder="Escribe una nota sobre la venta..."
            className="
              w-full rounded-lg py-2 px-4 text-sm outline-none resize-none border
              bg-white border-gray-300
              focus:ring-1 focus:ring-amber-500
              dark:bg-zinc-900/50 dark:border-zinc-800
            "
          ></textarea>
        </div>
      </div>

      {/* Botones */}
      <div className="grid grid-cols-2 gap-4">
        <button className="
          py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border
          bg-red-100 text-red-600 border-red-300 hover:bg-red-200
          dark:bg-red-950/20 dark:text-red-500 dark:border-red-900/50 dark:hover:bg-red-950/40
        ">
          Cancelar
        </button>

        <button className="
          py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all uppercase tracking-widest text-sm shadow-lg shadow-amber-900/20
        ">
          Confirmar venta
        </button>
      </div>

    </div>
  );
};

export default PaymentModule;
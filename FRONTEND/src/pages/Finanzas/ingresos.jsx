import React from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Star,
  RotateCcw
} from 'lucide-react';

const Ingresos = () => {

  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
    goldBorder: 'border-[#D4AF37]',
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-light tracking-widest uppercase text-black dark:text-white">
          Ingresos <span className={theme.gold}>|</span>
        </h1>

        <button className={`${theme.goldBg} text-black px-6 py-2.5 rounded-sm flex items-center gap-2 hover:brightness-110 transition-all font-medium uppercase text-sm tracking-tighter`}>
          <Plus size={18} />
          Ingreso Extra
        </button>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Monto Total', value: 'S/ 12,450.00', icon: Wallet },
          { label: 'Servicios', value: 'S/ 8,200.00', icon: TrendingUp },
          { label: 'Productos', value: 'S/ 3,150.00', icon: ShoppingBag },
          { label: 'Ganancias Extra', value: 'S/ 1,100.00', icon: Star },
        ].map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#141414] p-6 border-b-2 border-[#D4AF37] shadow-xl rounded-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                {card.label}
              </p>
              <card.icon className={theme.gold} size={20} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-[#141414] p-6 mb-8 rounded-sm shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">
              Rango de Fechas
            </label>
            <input 
              type="date" 
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37]" 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">
              Tipo de Ingreso
            </label>
            <select className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37]">
              <option>Todos</option>
              <option>Servicio</option>
              <option>Producto</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">
              Método de Pago
            </label>
            <select className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37]">
              <option>Efectivo</option>
              <option>Yape/Plin</option>
              <option>Tarjeta</option>
            </select>
          </div>

          <button className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity pb-2">
            <RotateCcw size={14} /> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-[#141414] rounded-sm overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left border-collapse">
          
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Fecha</th>
              <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Tipo</th>
              <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Descripción</th>
              <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Monto</th>
              <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Método</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              { date: '2024-05-04', type: 'Servicio', desc: 'Corte + Tinte Premium', amount: 'S/ 180.00', method: 'Tarjeta' },
              { date: '2024-05-04', type: 'Producto', desc: 'Shampoo Post-Tratamiento', amount: 'S/ 85.00', method: 'Yape' },
              { date: '2024-05-03', type: 'Otros', desc: 'Propina Especial', amount: 'S/ 20.00', method: 'Efectivo' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="p-4 text-sm font-light">{row.date}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase ${
                    row.type === 'Servicio'
                      ? 'bg-blue-900/20 text-blue-400'
                      : 'bg-amber-900/20 text-amber-400'
                  }`}>
                    {row.type}
                  </span>
                </td>
                <td className="p-4 text-sm opacity-80">{row.desc}</td>
                <td className={`p-4 text-sm font-semibold ${theme.gold}`}>{row.amount}</td>
                <td className="p-4 text-sm font-light italic">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs opacity-50 uppercase">
            Mostrando 1 a 3 de 15
          </span>

          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ChevronLeft size={18} className={theme.gold} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ChevronRight size={18} className={theme.gold} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Ingresos;
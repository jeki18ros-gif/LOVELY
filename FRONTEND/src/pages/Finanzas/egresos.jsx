import React from 'react';
import { 
  MinusCircle, 
  ArrowDownCircle, 
  Package, 
  Droplets, 
  Wrench, 
  AlertTriangle, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const Egresos = () => {

  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
    goldBorder: 'border-[#D4AF37]',
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-black dark:text-white">
            Egresos <span className={theme.gold}>/</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">
            Gestión de gastos y costos operativos
          </p>
        </div>

        <button className={`${theme.goldBg} text-black px-6 py-2.5 rounded-sm flex items-center gap-2 hover:brightness-110 transition-all font-semibold uppercase text-xs tracking-wider shadow-lg shadow-[#D4AF37]/20`}>
          <MinusCircle size={16} />
          Nuevo Egreso
        </button>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        
        {/* Card principal */}
        <div className="bg-black text-white dark:bg-white dark:text-black p-5 rounded-sm shadow-xl flex flex-col justify-between border-l-4 border-[#D4AF37]">
          <p className="text-[10px] uppercase tracking-widest opacity-70">
            Total Egresos
          </p>
          <h2 className="text-2xl font-bold mt-2">
            S/ 4,820.50
          </h2>
        </div>

        {[
          { label: 'Productos', value: 'S/ 1,200', icon: Package },
          { label: 'Materiales', value: 'S/ 450', icon: Droplets },
          { label: 'Servicios', value: 'S/ 890', icon: ArrowDownCircle },
          { label: 'Mantenimiento', value: 'S/ 320', icon: Wrench },
        ].map((item, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-[#141414] p-5 rounded-sm border border-gray-200 dark:border-gray-800 transition-transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start opacity-60">
              <p className="text-[9px] uppercase tracking-widest font-bold">
                {item.label}
              </p>
              <item.icon size={14} className={theme.gold} />
            </div>
            <p className="text-xl font-light mt-2 tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8 items-center bg-transparent border-b border-gray-200 dark:border-gray-800 pb-6">
        
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Filter size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Filtrar por:
          </span>
        </div>

        <select className="bg-transparent border-none text-xs uppercase tracking-tighter focus:ring-0 cursor-pointer">
          <option>Categoría: Todas</option>
          <option>Operativos</option>
          <option>Imprevistos</option>
          <option>Devoluciones</option>
        </select>

        <input 
          type="month" 
          className="bg-transparent border-none text-xs uppercase focus:ring-0" 
        />

        <button className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
          <RotateCcw size={12} /> Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-[#141414] rounded-sm overflow-hidden border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left">
          
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60">Fecha</th>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60">Categoría</th>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60">Descripción</th>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60 text-right">Monto</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              { date: '2024-05-02', cat: 'Compra de Productos', desc: 'Lote de tintes (Gama Dorada)', amount: '650.00', color: 'bg-blue-400' },
              { date: '2024-05-01', cat: 'Pagos de Servicios', desc: 'Recibo de Energía Eléctrica', amount: '280.00', color: 'bg-purple-400' },
              { date: '2024-04-28', cat: 'Imprevistos', desc: 'Reparación de grifería', amount: '120.00', color: 'bg-rose-400', icon: true },
              { date: '2024-04-25', cat: 'Devoluciones', desc: 'Reembolso cliente por tratamiento', amount: '150.00', color: 'bg-orange-400' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                
                <td className="p-5 text-sm font-light opacity-70">
                  {row.date}
                </td>

                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                    <span className="text-[11px] uppercase tracking-wider font-medium">
                      {row.cat}
                    </span>
                  </div>
                </td>

                <td className="p-5 text-sm font-light italic opacity-60 group-hover:opacity-100 transition-opacity">
                  {row.icon && (
                    <AlertTriangle size={12} className="inline mr-2 text-rose-500" />
                  )}
                  {row.desc}
                </td>

                <td className={`p-5 text-sm font-bold text-right ${theme.gold}`}>
                  - S/ {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">
            Elite Management System v1.0
          </p>

          <div className="flex gap-4">
            <button className="hover:text-[#D4AF37] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="hover:text-[#D4AF37] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Egresos;
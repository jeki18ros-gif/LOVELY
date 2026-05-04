import React, { useState } from 'react';
import { 
  Calendar, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Coins,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CierreCaja = () => {

  const [efectivoContado, setEfectivoContado] = useState('');

  const datosSistema = {
    ingresos: 650.00,
    egresos: 120.00,
    baseInicial: 100.00,
    metodos: {
      efectivo: 300.00,
      yape: 150.00,
      tarjeta: 200.00
    }
  };

  const gananciaDia = datosSistema.ingresos - datosSistema.egresos;
  const diferencia = efectivoContado ? (parseFloat(efectivoContado) - datosSistema.metodos.efectivo) : 0;

  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-light tracking-[0.25em] uppercase text-black dark:text-white">
            Cierre de Caja <span className={theme.gold}>.</span>
          </h1>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 opacity-60">
              <Calendar size={14} className={theme.gold} />
              <input type="date" className="bg-transparent text-xs" />
            </div>
          </div>
        </div>

        <button className={`${theme.goldBg} text-black px-8 py-3 rounded-sm flex items-center gap-3 hover:scale-105 transition-all font-bold uppercase text-xs tracking-widest`}>
          <Lock size={16} />
          Cerrar Caja
        </button>
      </header>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card title="Ingresos" value={datosSistema.ingresos} />
        <Card title="Egresos" value={datosSistema.egresos} red />
        <Card title="Ganancia" value={gananciaDia} highlight />
        <Card title="Base Inicial" value={datosSistema.baseInicial} />
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* METODOS */}
        <section className="bg-white dark:bg-[#141414] p-6 border dark:border-gray-800">
          <h4 className="text-xs uppercase tracking-widest mb-6 flex gap-2">
            <ArrowRightLeft size={16} className={theme.gold}/> Métodos de Pago
          </h4>

          {Object.entries(datosSistema.metodos).map(([k,v],i)=>(
            <div key={i} className="flex justify-between border-b border-gray-200 dark:border-gray-800 py-3 text-sm">
              <span className="uppercase">{k}</span>
              <span>S/ {v.toFixed(2)}</span>
            </div>
          ))}
        </section>

        {/* VALIDACION */}
        <section className="bg-gray-50 dark:bg-[#1a1a1a] p-6 border border-[#D4AF37]/30">
          <h4 className="text-xs uppercase tracking-widest mb-6 flex gap-2">
            <CheckCircle2 size={16} className={theme.gold}/> Validación
          </h4>

          <input
            type="number"
            value={efectivoContado}
            onChange={(e)=>setEfectivoContado(e.target.value)}
            placeholder="Efectivo contado"
            className="w-full bg-transparent border-b border-gray-400 text-2xl mb-6"
          />

          <div className="flex justify-between text-sm">
            <span>Esperado</span>
            <span>S/ {datosSistema.metodos.efectivo}</span>
          </div>

          <div className={`mt-4 p-4 ${diferencia===0?'bg-gray-500/10':diferencia>0?'bg-green-500/10':'bg-red-500/10'}`}>
            Diferencia: {diferencia.toFixed(2)}
          </div>

          {diferencia!==0 && (
            <div className="text-amber-500 text-xs mt-2 flex gap-2">
              <AlertCircle size={14}/>
              Diferencia será registrada
            </div>
          )}
        </section>

      </div>

      {/* 🔥 NUEVA SECCIÓN: HISTORIAL */}
      <div className="mt-12 bg-white dark:bg-[#141414] border dark:border-gray-800">

        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between">
          <h3 className="text-xs uppercase tracking-widest">Último Cierre de Caja</h3>
          <span className="text-[10px] opacity-50">Registro reciente</span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Hora</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Ingresos</th>
              <th className="p-3">Egresos</th>
              <th className="p-3">Diferencia</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-gray-200 dark:border-gray-800">
              <td className="p-3">2024-05-03</td>
              <td className="p-3">22:15</td>
              <td className="p-3">Admin</td>
              <td className="p-3">S/ 1200</td>
              <td className="p-3">S/ 300</td>
              <td className="p-3 text-green-500">0.00</td>
              <td className="p-3 text-green-500">Cuadrado</td>
            </tr>
          </tbody>
        </table>

        {/* paginacion */}
        <div className="flex justify-end gap-2 p-3">
          <ChevronLeft size={18}/>
          <ChevronRight size={18}/>
        </div>
      </div>

    </div>
  );
};

/* COMPONENTE CARD */
const Card = ({title,value,red,highlight}) => (
  <div className={`p-5 ${highlight?'bg-black text-white dark:bg-white dark:text-black':'bg-white dark:bg-[#141414]'} border`}>
    <p className="text-xs opacity-60">{title}</p>
    <h3 className={`text-xl ${red?'text-red-400':''}`}>
      S/ {value.toFixed(2)}
    </h3>
  </div>
);

export default CierreCaja;
import React, { useState } from 'react';
import { History, FileText, Scissors, Package } from 'lucide-react';

// Importación de los componentes hijos
import CierreCaja from '../componentes/historial/finanzas/cierreDeCaja';
import Ventas from '../componentes/historial/ventas/ventas';
import Citas from '../componentes/historial/citas/citas';
import HistoryProductos from '../componentes/historial/movimientos/productosHistorial';
import HistoryServicio from '../componentes/historial/movimientos/serviciosHistorial';

export default function HistoryGeneral() {
  const [activeTab, setActiveTab] = useState('financiero');
  
  // Filtros locales para pestañas específicas
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [tipoVistaMov, setTipoVistaMov] = useState('Productos');

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-black dark:text-white">
          Módulo de Historiales <span className="text-[#D4AF37]">/</span>
        </h1>
        <p className="text-xs text-gray-400 mt-2 tracking-wide uppercase">Auditoría general del sistema de peluquería</p>
      </header>

      {/* PESTAÑAS (TABS) */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-800 mb-8 gap-2">
        {[
          { id: 'financiero', label: 'Cierres de Caja', icon: History },
          { id: 'ventas', label: 'Historial de Ventas', icon: FileText },
          { id: 'citas', label: 'Control de Citas', icon: Scissors },
          { id: 'movimientos', label: 'Movimientos catálogo', icon: Package },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3.5 text-xs font-medium uppercase tracking-widest transition-all rounded-t-sm border-b-2 ${
                isActive 
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-white dark:bg-[#141414]' 
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR GLOBAL */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm shadow-xl overflow-hidden">
        
        {/* Renderizado condicional de componentes hijos */}
        {activeTab === 'financiero' && (
          <CierreCaja />
        )}

        {activeTab === 'ventas' && (
          <Ventas 
            filtroMetodo={filtroMetodo} 
            setFiltroMetodo={setFiltroMetodo} 
          />
        )}

        {activeTab === 'citas' && (
          <Citas 
            filtroEstado={filtroEstado} 
            setFiltroEstado={setFiltroEstado} 
          />
        )}

        {activeTab === 'movimientos' && (
          <div>
            {/* Sub-selector estilizado para hacer match con el padding del hijo */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50 border-b border-gray-200 dark:border-gray-800 flex gap-2">
              {['Productos', 'Servicios'].map(v => (
                <button
                  key={v}
                  onClick={() => setTipoVistaMov(v)}
                  className={`px-5 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all rounded-sm ${
                    tipoVistaMov === v 
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md shadow-[#D4AF37]/10' 
                      : 'border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Componentes independientes y limpios conectados a Supabase */}
            {tipoVistaMov === 'Productos' ? (
              <HistoryProductos />
            ) : (
              <HistoryServicio />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
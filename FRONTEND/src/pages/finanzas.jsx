import React, { useState } from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

// Importación de los componentes hijos basados en la estructura financiera
import CierreCaja from '../componentes/finanzas/cierredecaja/cierreCaja';
import Egresos from '../componentes/finanzas/egresos/egresos'; // O la ruta exacta donde guardaste tus Egresos
import Ingresos from '../componentes/finanzas/ingresos/ingresos'; // Tu componente de Ingresos / Ventas directas

export default function FinanzasGeneral() {
  // Inicializa con 'cierre' para que sea la primera vista en renderizarse
  const [activeTab, setActiveTab] = useState('cierre');
  
  // Filtros globales compartidos opcionales en caso de que tus hijos los requieran
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('Todos');

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-black dark:text-white">
          Gestión Financiera <span className="text-[#D4AF37]">/</span>
        </h1>
        <p className="text-xs text-gray-400 mt-2 tracking-wide uppercase">
          Control de caja, flujo de ingresos y egresos de la peluquería
        </p>
      </header>

      {/* PESTAÑAS (TABS) */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-800 mb-8 gap-2">
        {[
          { id: 'cierre', label: 'Cierres de Caja', icon: Landmark },
          { id: 'ingresos', label: 'Flujo de Ingresos', icon: ArrowUpRight },
          { id: 'egresos', label: 'Flujo de Egresos', icon: ArrowDownLeft },
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
              <Icon size={14} className={isActive ? 'text-[#D4AF37]' : ''} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR GLOBAL */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm shadow-xl overflow-hidden">
        
        {/* Renderizado condicional de las vistas financieras */}
        {activeTab === 'cierre' && (
          <CierreCaja />
        )}

        {activeTab === 'ingresos' && (
          <Ingresos 
            filtroMetodoPago={filtroMetodoPago} 
            setFiltroMetodoPago={setFiltroMetodoPago} 
          />
        )}

        {activeTab === 'egresos' && (
          <Egresos />
        )}

      </div>
    </div>
  );
}
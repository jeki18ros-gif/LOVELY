import React, { useState } from 'react';
import { History, FileText, Scissors, Package, ChevronLeft, ChevronRight } from 'lucide-react';

// Importación de los componentes hijos
import CierreCaja from '../componentes/historial/finanzas/cierreDeCaja';
import Ventas from '../componentes/historial/ventas/ventas';
import Citas from '../componentes/historial/citas/citas';
import HistoryProductos from '../componentes/historial/movimientos/productosHistorial';
import HistoryServicio from '../componentes/historial/movimientos/serviciosHistorial';

export default function HistoryGeneral() {
  const [activeTab, setActiveTab] = useState('financiero');
  
  // Filtros locales
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [tipoVistaMov, setTipoVistaMov] = useState('Productos');

  // ==========================================
  // MOCK DATA (Mantienes temporalmente los que no se han migrado)
  // ==========================================
  const cierresCaja = [
    { id: 1, fecha: '2026-05-17', hora: '22:15', usuario: 'Admin', ingresos: 1200, egresos: 300, diferencia: 0, estado: 'Cuadrado' },
    { id: 2, fecha: '2026-05-16', hora: '21:50', usuario: 'Luis', ingresos: 950, egresos: 150, diferencia: -20, estado: 'Faltante' }
  ];

  const ventas = [
    { id: 1, cliente: 'Carlos Pérez', fecha: '2026-05-17 10:30', total: 85, metodo: 'Efectivo', usuario: 'Luis', estado: 'Pagado', pdf: '#' },
    { id: 2, cliente: 'María López', fecha: '2026-05-17 12:10', total: 120, metodo: 'Yape', usuario: 'Ana', estado: 'Pagado', pdf: '#' },
    { id: 3, cliente: 'Juan Torres', fecha: '2026-05-16 14:00', total: 45, metodo: 'Tarjeta', usuario: 'Luis', estado: 'Anulado', pdf: '#' }
  ];

  const citas = [
    { id: 1, cliente: 'Carlos Pérez', servicio: 'Corte + Barba', fecha: '2026-05-17', hora: '10:30', profesional: 'Luis', monto: 45, metodo: 'Efectivo', estado: 'Realizada' },
    { id: 2, cliente: 'María López', servicio: 'Tinte Completo', fecha: '2026-05-16', hora: '14:00', profesional: 'Ana', monto: 120, metodo: 'Yape', estado: 'Cancelada' },
    { id: 3, cliente: 'Juan Torres', servicio: 'Corte', fecha: '2026-05-15', hora: '16:00', profesional: 'Luis', monto: 30, metodo: 'Tarjeta', estado: 'No asistió' }
  ];

  // ==========================================
  // FILTRADO DE DATOS LOCALES
  // ==========================================
  const ventasFiltradas = filtroMetodo === 'Todos' ? ventas : ventas.filter(v => v.metodo === filtroMetodo);
  const citasFiltradas = filtroEstado === 'Todos' ? citas : citas.filter(c => c.estado === filtroEstado);

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
        {activeTab === 'financiero' && <CierreCaja cierresCaja={cierresCaja} />}

        {activeTab === 'ventas' && (
          <Ventas 
            ventasFiltradas={ventasFiltradas} 
            filtroMetodo={filtroMetodo} 
            setFiltroMetodo={setFiltroMetodo} 
          />
        )}

        {activeTab === 'citas' && (
          <Citas 
            citasFiltradas={citasFiltradas} 
            filtroEstado={filtroEstado} 
            setFiltroEstado={setFiltroEstado} 
          />
        )}

        {activeTab === 'movimientos' && (
          <div>
            {/* Sub-selector para Productos / Servicios */}
            <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex gap-2">
              {['Productos', 'Servicios'].map(v => (
                <button
                  key={v}
                  onClick={() => setTipoVistaMov(v)}
                  className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                    tipoVistaMov === v ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-gray-300 dark:border-gray-800 opacity-60'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Componentes limpios sin la prop 'movimientos' heredada */}
            {tipoVistaMov === 'Productos' ? (
              <HistoryProductos />
            ) : (
              <HistoryServicio />
            )}
          </div>
        )}

        {/* PIE DE TABLA COMÚN (Ocultar o condicionar si los hijos manejan su propia paginación) */}
        {activeTab !== 'movimientos' && (
          <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs opacity-70">
            <span>Mostrando registros de auditoría recientes</span>
            <div className="flex gap-4 items-center">
              <button className="p-1 hover:text-[#D4AF37] transition-colors"><ChevronLeft size={16}/></button>
              <span className="tracking-widest uppercase text-[10px] font-bold">Página 1 de 1</span>
              <button className="p-1 hover:text-[#D4AF37] transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  Scissors,
  Package,
  FileText,
  Filter,
  RotateCcw,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Repeat,
  Plus,
  Pencil,
  Trash2,
  Lock
} from 'lucide-react';

export default function HistoryGeneral() {
  // PESTAÑA ACTIVA: 'financiero' | 'ventas' | 'citas' | 'movimientos'
  const [activeTab, setActiveTab] = useState('financiero');
  
  // FILTROS GLOBALES/LOCALES
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [tipoVistaMov, setTipoVistaMov] = useState('Productos');

  // ==========================================
  // MOCK DATA (Sustituir por estados de Supabase)
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

  const movimientosCat = [
    { id: 1, tipo: 'Producto', accion: 'Editado', nombre: 'Shampoo Premium', usuario: 'Admin', fecha: '2026-05-17 12:30', actual: { precio: 35 }, anterior: { precio: 30 } },
    { id: 2, tipo: 'Servicio', accion: 'Eliminado', nombre: 'Corte Clásico', usuario: 'Luis', fecha: '2026-05-16 11:00', actual: null, anterior: { precio: 25 } },
    { id: 3, tipo: 'Producto', accion: 'Creado', nombre: 'Gel Fijador', usuario: 'Ana', fecha: '2026-05-15 10:00', actual: { precio: 20 }, anterior: null }
  ];

  // ==========================================
  // FILTRADO DE DATOS EN CLIENTE
  // ==========================================
  const ventasFiltradas = filtroMetodo === 'Todos' ? ventas : ventas.filter(v => v.metodo === filtroMetodo);
  const citasFiltradas = filtroEstado === 'Todos' ? citas : citas.filter(c => c.estado === filtroEstado);
  const movFiltrados = movimientosCat.filter(m => m.tipo === tipoVistaMov.slice(0, -1));

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-black dark:text-white">
          Módulo de Historiales <span className="text-[#D4AF37]">/</span>
        </h1>
        <p className="text-xs text-gray-400 mt-2 tracking-wide uppercase">Auditoría general del sistema de peluquería</p>
      </header>

      {/* PESTAÑAS (TABS) PREMIUM */}
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
              onClick={() => { setActiveTab(tab.id); }}
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

      {/* RECTÁNGULO DE CONTENIDO GLOBAL */}
      <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm shadow-xl overflow-hidden">
        
        {/* =========================================================
            TAB 1: HISTORIAL FINANCIERO (CIERRES DE CAJA)
           ========================================================= */}
        {activeTab === 'financiero' && (
          <div>
            <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest font-semibold opacity-70">Libro de Balances Diarios</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
                  <th className="p-4">Fecha / Hora</th>
                  <th className="p-4">Auditor/Cajero</th>
                  <th className="p-4 text-right">Ingresos</th>
                  <th className="p-4 text-right">Egresos</th>
                  <th className="p-4 text-right">Diferencia</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {cierresCaja.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <td className="p-4 font-light">{c.fecha} <span className="text-xs opacity-40 ml-2">{c.hora}</span></td>
                    <td className="p-4 flex items-center gap-2 font-medium"><User size={14} className="text-[#D4AF37]" /> {c.usuario}</td>
                    <td className="p-4 text-right text-emerald-500 font-medium">S/ {c.ingresos.toFixed(2)}</td>
                    <td className="p-4 text-right text-rose-500">S/ {c.egresos.toFixed(2)}</td>
                    <td className={`p-4 text-right font-bold ${c.diferencia === 0 ? 'opacity-40' : 'text-rose-500'}`}>
                      S/ {c.diferencia.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-sm ${c.estado === 'Cuadrado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================================================
            TAB 2: HISTORIAL DE VENTAS
           ========================================================= */}
        {activeTab === 'ventas' && (
          <div>
            <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-medium"><Filter size={14}/> Filtrar Pasarela:</div>
              <select value={filtroMetodo} onChange={(e) => setFiltroMetodo(e.target.value)} className="bg-transparent text-xs uppercase outline-none focus:text-[#D4AF37]">
                <option value="Todos">Todos los métodos</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Fecha Emisión</th>
                  <th className="p-4 text-right">Total Facturado</th>
                  <th className="p-4">Canal</th>
                  <th className="p-4">Cajero</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {ventasFiltradas.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <td className="p-4 font-medium">{v.cliente}</td>
                    <td className="p-4 text-xs opacity-70">{v.fecha}</td>
                    <td className="p-4 text-right text-[#D4AF37] font-bold">S/ {v.total.toFixed(2)}</td>
                    <td className="p-4 text-xs font-light italic">{v.metodo}</td>
                    <td className="p-4">{v.usuario}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full ${v.estado === 'Pagado' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {v.estado}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-4">
                      <button className="text-[#D4AF37] hover:scale-110 transition-transform" title="Ver Comprobante"><FileText size={16}/></button>
                      <button className="hover:text-[#D4AF37] transition-colors" title="Detalle de Artículos"><Eye size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================================================
            TAB 3: HISTORIAL DE CITAS
           ========================================================= */}
        {activeTab === 'citas' && (
          <div>
            <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-medium"><Filter size={14}/> Estado de Agenda:</div>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="bg-transparent text-xs uppercase outline-none">
                <option value="Todos">Ver Todas</option>
                <option value="Realizada">Realizada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="No asistió">No asistió</option>
              </select>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Tratamiento/Servicio</th>
                  <th className="p-4">Planificación</th>
                  <th className="p-4">Estilista</th>
                  <th className="p-4 text-right">Costo</th>
                  <th className="p-4">Flujo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {citasFiltradas.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <td className="p-4 font-medium">{c.cliente}</td>
                    <td className="p-4 text-xs tracking-wider opacity-90">{c.servicio}</td>
                    <td className="p-4 text-xs font-light">{c.fecha} a las <span className="font-medium">{c.hora}</span></td>
                    <td className="p-4">{c.profesional}</td>
                    <td className="p-4 text-right text-black dark:text-white font-medium">S/ {c.monto.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] uppercase font-medium rounded-sm ${
                        c.estado === 'Realizada' ? 'bg-emerald-500/10 text-emerald-400' : c.estado === 'Cancelada' ? 'bg-rose-500/10 text-rose-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================================================
            TAB 4: MOVIMIENTOS DE CATÁLOGO (PRODUCTOS / SERVICIOS)
           ========================================================= */}
        {activeTab === 'movimientos' && (
          <div>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
                  <th className="p-4">Operación</th>
                  <th className="p-4">Ítem Modificado</th>
                  <th className="p-4">Auditoría de Valores (Precio)</th>
                  <th className="p-4">Autor</th>
                  <th className="p-4">Fecha Log</th>
                  <th className="p-4 text-center">Acción Sincronizada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {movFiltrados.map(m => {
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] rounded-sm font-bold uppercase ${
                          m.accion === 'Creado' ? 'text-emerald-400 bg-emerald-500/10' : m.accion === 'Editado' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {m.accion}
                        </span>
                      </td>
                      <td className="p-4 font-light">{m.nombre}</td>
                      <td className="p-4 text-xs">
                        {m.anterior && m.actual ? (
                          <span>
                            <span className="text-rose-400 line-through">S/ {m.anterior.precio}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="text-emerald-400 font-medium">S/ {m.actual.precio}</span>
                          </span>
                        ) : m.accion === 'Creado' ? (
                          <span className="text-emerald-400 font-medium">Alta: S/ {m.actual?.precio}</span>
                        ) : (
                          <span className="text-rose-400 font-medium">Baja (S/ {m.anterior?.precio})</span>
                        )}
                      </td>
                      <td className="p-4">{m.usuario}</td>
                      <td className="p-4 text-xs opacity-60">{m.fecha}</td>
                      <td className="p-4 text-center">
                        {(m.accion === 'Editado' || m.accion === 'Eliminado') && (
                          <button className="text-xs text-[#D4AF37] font-medium tracking-wide hover:underline inline-flex items-center gap-1">
                            <RotateCcw size={12}/> Revertir cambio
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PIE DE TABLA COMÚN: PAGINACIÓN PREMIUM */}
        <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs opacity-70">
          <span>Mostrando registros de auditoría recientes</span>
          <div className="flex gap-4 items-center">
            <button className="p-1 hover:text-[#D4AF37] transition-colors"><ChevronLeft size={16}/></button>
            <span className="tracking-widest uppercase text-[10px] font-bold">Página 1 de 1</span>
            <button className="p-1 hover:text-[#D4AF37] transition-colors"><ChevronRight size={16}/></button>
          </div>
        </div>

      </div>
    </div>
  );
}
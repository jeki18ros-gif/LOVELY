import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Wallet, 
  Package, 
  Droplets, 
  AlertTriangle, 
  RotateCcw,
  X
} from 'lucide-react';
// IMPORTA TU CLIENTE DE SUPABASE
import { supabase } from '../../lib/supabase'; 

const Egresos = () => {
  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
    goldBorder: 'border-[#D4AF37]',
  };

  // ESTADOS PARA DATOS Y FILTROS
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // ESTADOS PARA EL MODAL DE NUEVO EGRESO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevaCat, setNuevaCat] = useState('Compra de Productos');
  const [nuevoMetodo, setNuevoMetodo] = useState('Efectivo');

  // ==========================================
  // 1. PETICIÓN A SUPABASE (TRAER EGRESOS)
  // ==========================================
  const fetchEgresos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('egresos')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setEgresos(data || []);
    } catch (error) {
      console.error('Error cargando egresos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEgresos();
  }, []);

  // ==========================================
  // 2. LÓGICA DEL FORMULARIO: NUEVO EGRESO
  // ==========================================
  const handleSaveEgreso = async (e) => {
    e.preventDefault();
    if (!nuevoMonto || parseFloat(nuevoMonto) <= 0) return;

    try {
      const { error } = await supabase
        .from('egresos')
        .insert([
          {
            monto: parseFloat(nuevoMonto),
            categoria: nuevaCat,
            descripcion: nuevaDesc,
            metodo_pago: nuevoMetodo
          }
        ]);

      if (error) throw error;

      // Limpiar, cerrar modal y refrescar la tabla
      setNuevoMonto('');
      setNuevaDesc('');
      setNuevaCat('Compra de Productos');
      setNuevoMetodo('Efectivo');
      setIsModalOpen(false);
      fetchEgresos(); 
    } catch (error) {
      console.error('Error al guardar egreso:', error.message);
      alert('No se pudo registrar el egreso');
    }
  };

  // ==========================================
  // 3. FILTROS EN CLIENTE
  // ==========================================
  const limpiarFiltros = () => {
    setFiltroFecha('');
    setFiltroCategoria('Todos');
  };

  const egresosFiltrados = egresos.filter(item => {
    const cumpleFecha = filtroFecha ? item.fecha?.startsWith(filtroFecha) : true;
    const cumpleCat = filtroCategoria === 'Todos' ? true : item.categoria === filtroCategoria;
    return cumpleFecha && cumpleCat;
  });

  // ==========================================
  // 4. CÁLCULO DE LAS TARJETAS (RESUMEN)
  // ==========================================
  const totales = egresos.reduce((acc, item) => {
    const montoNum = Number(item.monto || 0);
    acc.total += montoNum;

    if (item.categoria === 'Compra de Productos') {
      acc.productos += montoNum;
    } else if (item.categoria === 'Pagos de Servicios' || item.categoria === 'Materiales') {
      acc.servicios += montoNum;
    } else {
      acc.otros += montoNum; // Imprevistos / Devoluciones
    }
    return acc;
  }, { total: 0, productos: 0, servicios: 0, otros: 0 });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-light tracking-widest uppercase text-black dark:text-white">
          Egresos <span className={theme.gold}>/</span>
        </h1>

        <button 
          onClick={() => setIsModalOpen(true)}
          className={`${theme.goldBg} text-black px-6 py-2.5 rounded-sm flex items-center gap-2 hover:brightness-110 transition-all font-medium uppercase text-sm tracking-tighter`}
        >
          <Plus size={18} />
          Nuevo Egreso
        </button>
      </header>

      {/* Cards de Resumen (Mismo diseño que Ingresos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Egresos', value: totales.total, icon: Wallet },
          { label: 'Productos', value: totales.productos, icon: Package },
          { label: 'Servicios e Insumos', value: totales.servicios, icon: Droplets },
          { label: 'Otros / Imprevistos', value: totales.otros, icon: AlertTriangle },
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
              - S/ {card.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-[#141414] p-6 mb-8 rounded-sm shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Rango de Fechas</label>
            <input 
              type="date" 
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37] dark:text-white text-black" 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Categoría</label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37] dark:bg-[#141414]"
            >
              <option value="Todos">Todas</option>
              <option value="Compra de Productos">Compra de Productos</option>
              <option value="Pagos de Servicios">Pagos de Servicios</option>
              <option value="Imprevistos">Imprevistos</option>
              <option value="Devoluciones">Devoluciones</option>
            </select>
          </div>

          <button 
            onClick={limpiarFiltros}
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity pb-2"
          >
            <RotateCcw size={14} /> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla Conectada */}
      <div className="bg-white dark:bg-[#141414] rounded-sm overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
        {loading ? (
          <div className="p-10 text-center uppercase tracking-widest text-sm opacity-50">Cargando base de datos...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Fecha</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Categoría</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Descripción</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium text-right">Monto</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {egresosFiltrados.map((row) => {
                const esImprevisto = row.categoria === 'Imprevistos';
                return (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group">
                    <td className="p-4 text-sm font-light">
                      {new Date(row.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase ${
                        esImprevisto ? 'bg-rose-900/20 text-rose-400' : 'bg-amber-900/20 text-amber-400'
                      }`}>
                        {row.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-sm opacity-80 italic">
                      {esImprevisto && <AlertTriangle size={12} className="inline mr-1 text-rose-500" />}
                      {row.descripcion}
                    </td>
                    <td className="p-4 text-sm font-bold text-right text-rose-500 dark:text-rose-400">
                      - S/ {Number(row.monto).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm font-light italic">{row.metodo_pago}</td>
                  </tr>
                );
              })}
              {egresosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-sm opacity-40">No hay egresos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ==========================================
          MODAL FORMULARIO NUEVO EGRESO
         ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#141414] w-full max-w-md p-6 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light uppercase tracking-widest text-black dark:text-white">
                Registrar Nuevo Egreso
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEgreso} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Monto (S/)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Categoría</label>
                <select 
                  value={nuevaCat}
                  onChange={(e) => setNuevaCat(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:border-[#D4AF37] dark:bg-[#141414]"
                >
                  <option value="Compra de Productos">Compra de Productos</option>
                  <option value="Pagos de Servicios">Pagos de Servicios</option>
                  <option value="Imprevistos">Imprevistos</option>
                  <option value="Devoluciones">Devoluciones</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Descripción / Motivo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Pago recibo de luz LuzSur, Lote de tintes, etc."
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Método de Pago</label>
                <select 
                  value={nuevoMetodo}
                  onChange={(e) => setNuevoMetodo(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:border-[#D4AF37] dark:bg-[#141414]"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape">Yape / Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border border-gray-300 dark:border-gray-700 py-2 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`w-1/2 ${theme.goldBg} text-black py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all`}
                >
                  Guardar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Egresos;
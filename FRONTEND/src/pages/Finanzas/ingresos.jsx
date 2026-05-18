import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Star,
  RotateCcw,
  X
} from 'lucide-react';
// 1. IMPORTA TU CLIENTE DE SUPABASE
import { supabase } from '../../lib/supabase'; 

const Ingresos = () => {
  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
    goldBorder: 'border-[#D4AF37]',
  };

  // ESTADOS PARA DATOS Y FILTROS
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');

  // ESTADOS PARA EL MODAL DE INGRESO EXTRA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevoMetodo, setNuevoMetodo] = useState('Efectivo');

  // ==========================================
  // 2. PETICIÓN A SUPABASE (TRAER PAGOS)
  // ==========================================
  const fetchIngresos = async () => {
    setLoading(true);
    try {
      // Hacemos un select de pagos y un JOIN implícito hacia 'ventas' usando el codigo_venta
      // Esto nos permite saber si el pago viene de una venta y qué tipo de detalle tiene.
      const { data, error } = await supabase
        .from('pago')
        .select(`
          id,
          created_at,
          tipo,
          descripcion,
          monto,
          codigo_venta,
          ventas (
            id,
            nombre_cliente
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIngresos(data || []);
    } catch (error) {
      console.error('Error cargando ingresos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  // ==========================================
  // 3. LÓGICA DEL FORMULARIO: INGRESO EXTRA
  // ==========================================
  const handleSaveIngresoExtra = async (e) => {
    e.preventDefault();
    if (!nuevoMonto || parseFloat(nuevoMonto) <= 0) return;

    try {
      const { error } = await supabase
        .from('pago')
        .insert([
          {
            monto: parseFloat(nuevoMonto),
            tipo: nuevoMetodo, // Efectivo, Yape, etc.
            descripcion: nuevaDesc || 'Ingreso Extra',
            codigo_venta: null // Al ser extra, viaja explícitamente como NULL
          }
        ]);

      if (error) throw error;

      // Resetear formulario, cerrar modal y refrescar la lista
      setNuevoMonto('');
      setNuevaDesc('');
      setNuevoMetodo('Efectivo');
      setIsModalOpen(false);
      fetchIngresos(); 
    } catch (error) {
      console.error('Error al guardar ingreso extra:', error.message);
      alert('No se pudo registrar el ingreso extra');
    }
  };

  // ==========================================
  // 4. FILTROS EN CLIENTE (JAVASCRIPT)
  // ==========================================
  const limpiarFiltros = () => {
    setFiltroFecha('');
    setFiltroTipo('Todos');
    setFiltroMetodo('Todos');
  };

  const ingresosFiltrados = ingresos.filter(item => {
    const cumpleFecha = filtroFecha ? item.created_at?.startsWith(filtroFecha) : true;
    
    // Determinar si es Servicio, Producto o Extra basándonos en la descripción o código de venta
    let tipoItem = 'Extra';
    if (item.codigo_venta) {
      // Identificación rápida por palabras clave (puedes adaptarlo según tu lógica de negocio)
      const descLower = item.descripcion?.toLowerCase() || '';
      if (descLower.includes('shampoo') || descLower.includes('producto')) {
        tipoItem = 'Producto';
      } else {
        tipoItem = 'Servicio'; // Por defecto si viene de una venta
      }
    }
    const cumpleTipo = filtroTipo === 'Todos' ? true : tipoItem === filtroTipo;
    const cumpleMetodo = filtroMetodo === 'Todos' ? true : item.tipo === filtroMetodo;

    return cumpleFecha && cumpleTipo && cumpleMetodo;
  });

  // ==========================================
  // 5. CÁLCULO DE LAS TARJETAS (RESUMEN)
  // ==========================================
  const totales = ingresos.reduce((acc, item) => {
    const montoNum = Number(item.monto || 0);
    acc.total += montoNum;

    if (!item.codigo_venta) {
      acc.extra += montoNum;
    } else {
      // Separación demostrativa (ajústala si guardas banderas específicas en tu BD)
      const descLower = item.descripcion?.toLowerCase() || '';
      if (descLower.includes('shampoo') || descLower.includes('producto')) {
        acc.productos += montoNum;
      } else {
        acc.servicios += montoNum;
      }
    }
    return acc;
  }, { total: 0, servicios: 0, productos: 0, extra: 0 });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-light tracking-widest uppercase text-black dark:text-white">
          Ingresos <span className={theme.gold}>|</span>
        </h1>

        {/* BOTÓN PARA ABRIR MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`${theme.goldBg} text-black px-6 py-2.5 rounded-sm flex items-center gap-2 hover:brightness-110 transition-all font-medium uppercase text-sm tracking-tighter`}
        >
          <Plus size={18} />
          Ingreso Extra
        </button>
      </header>

      {/* Cards Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Monto Total', value: totales.total, icon: Wallet },
          { label: 'Servicios', value: totales.servicios, icon: TrendingUp },
          { label: 'Productos', value: totales.productos, icon: ShoppingBag },
          { label: 'Ganancias Extra', value: totales.extra, icon: Star },
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
              S/ {card.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-[#141414] p-6 mb-8 rounded-sm shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Tipo de Ingreso</label>
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37] dark:bg-[#141414]"
            >
              <option value="Todos">Todos</option>
              <option value="Servicio">Servicio</option>
              <option value="Producto">Producto</option>
              <option value="Extra">Extra</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Método de Pago</label>
            <select 
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37] dark:bg-[#141414]"
            >
              <option value="Todos">Todos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Yape">Yape / Plin</option>
              <option value="Tarjeta">Tarjeta</option>
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
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Tipo</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Descripción</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Monto</th>
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {ingresosFiltrados.map((row) => {
                const esExtra = !row.codigo_venta;
                return (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4 text-sm font-light">
                      {new Date(row.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase ${
                        esExtra ? 'bg-purple-900/20 text-purple-400' : 'bg-blue-900/20 text-blue-400'
                      }`}>
                        {esExtra ? 'Extra' : 'Venta'}
                      </span>
                    </td>
                    <td className="p-4 text-sm opacity-80">
                      {row.descripcion || `Venta registrada de ${row.ventas?.nombre_cliente || 'Cliente'}`}
                    </td>
                    <td className={`p-4 text-sm font-semibold ${theme.gold}`}>
                      S/ {Number(row.monto).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm font-light italic">{row.tipo}</td>
                  </tr>
                );
              })}
              {ingresosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-sm opacity-40">No hay registros para los filtros seleccionados</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ==========================================
          5. MODAL FORMULARIO INGRESO EXTRA
         ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#141414] w-full max-w-md p-6 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light uppercase tracking-widest text-black dark:text-white">
                Registrar Ingreso Extra
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveIngresoExtra} className="space-y-5">
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
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Descripción / Concepto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Propina especial, Venta de café, etc."
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Método de Recepción</label>
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
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Ingresos;
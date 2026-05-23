import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Star,
  RotateCcw,
  X,
  Eye,
  Edit2,
  AlertCircle,
  Calendar // Añadido el icono de calendario
} from 'lucide-react';
import { supabase } from '../../../lib/supabase'; 

const Ingresos = () => {
  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
    goldBorder: 'border-[#D4AF37]',
  };

  // ==========================================
  // 1. ESTADOS PARA DATOS Y FILTROS (ACTUALIZADO)
  // ==========================================
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  // Ahora el filtro de fecha inicia con el día de hoy por defecto (YYYY-MM-DD)
  const [filtroFecha, setFiltroFecha] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');

  // ESTADOS PARA EL MODAL DE INGRESO EXTRA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevoMetodo, setNuevoMetodo] = useState('Efectivo');

  // ESTADOS PARA EL MODAL DE VER DETALLE
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState(null);

  // ESTADOS PARA EL MODAL DE EDICIÓN
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMonto, setEditMonto] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMetodo, setEditMetodo] = useState('Efectivo');
  const [esVenta, setEsVenta] = useState(false);

  // ==========================================
  // 2. PETICIÓN FILTRADA POR FECHA A SUPABASE (ACTUALIZADO)
  // ==========================================
  const fetchIngresos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('pago')
        .select(`
          id,
          tipo,
          descripcion,
          monto,
          fecha,
          codigo_venta,
          ventas!codigo_venta(
            id,
            fecha,
            nombre_cliente,
            detalle_venta (
              tipo,
              subtotal
            )
          )
        `);

      // Si hay una fecha seleccionada, filtramos el día entero desde las 00:00:00 hasta las 23:59:59
      if (filtroFecha) {
        const inicioDia = `${filtroFecha}T00:00:00.000Z`;
        const finDia = `${filtroFecha}T23:59:59.999Z`;
        query = query.gte('fecha', inicioDia).lte('fecha', finDia);
      }

      const { data, error } = await query;

      if (error) throw error;
      setIngresos(data || []);
    } catch (error) {
      console.error('Error cargando ingresos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Se vuelve a ejecutar automáticamente cada vez que cambia la 'filtroFecha'
  useEffect(() => {
    fetchIngresos();
  }, [filtroFecha]);

  // ==========================================
  // LÓGICA DEL FORMULARIO: INGRESO EXTRA Y EDICIÓN
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
            tipo: nuevoMetodo,
            descripcion: nuevaDesc || 'Ingreso Extra',
            codigo_venta: null,
            fecha: new Date().toISOString()
          }
        ]);

      if (error) throw error;

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

  const handleAbirEdicion = (ingreso) => {
    setEditId(ingreso.id);
    setEditMonto(ingreso.monto);
    setEditDesc(ingreso.descripcion || `Venta registrada de ${ingreso.ventas?.nombre_cliente || 'Cliente'}`);
    setEditMetodo(ingreso.tipo || 'Efectivo');
    setEsVenta(!!ingreso.codigo_venta); 
    setIsEditModalOpen(true);
  };

  const handleUpdateIngreso = async (e) => {
    e.preventDefault();
    if (!editMonto || parseFloat(editMonto) <= 0) return;

    try {
      const datosActualizados = {
        descripcion: editDesc,
        tipo: editMetodo
      };

      if (!esVenta) {
        datosActualizados.monto = parseFloat(editMonto);
      }

      const { error } = await supabase
        .from('pago')
        .update(datosActualizados)
        .eq('id', editId);

      if (error) throw error;

      setIsEditModalOpen(false);
      fetchIngresos();
    } catch (error) {
      console.error('Error al corregir el ingreso:', error.message);
      alert('No se pudieron actualizar los datos del ingreso');
    }
  };

  // ==========================================
  // FILTROS LOCALES (TIPO Y MÉTODO)
  // ==========================================
  const limpiarFiltros = () => {
    setFiltroFecha(new Date().toISOString().split('T')[0]); // Restablece al día de hoy
    setFiltroTipo('Todos');
    setFiltroMetodo('Todos');
  };

  const obtenerTipoReal = (item) => {
    if (!item.codigo_venta) return 'Extra';
    if (item.ventas?.detalle_venta && item.ventas.detalle_venta.length > 0) {
      const tieneProducto = item.ventas.detalle_venta.some(d => d.tipo?.toLowerCase() === 'producto');
      const tieneServicio = item.ventas.detalle_venta.some(d => d.tipo?.toLowerCase() === 'servicio');
      
      if (tieneProducto && tieneServicio) return 'Mixto';
      if (tieneProducto) return 'Producto';
      if (tieneServicio) return 'Servicio';
    }
    return 'Servicio'; 
  };

  // Removido el filtro de fecha de aquí ya que ahora se procesa directamente en la consulta de Supabase
  const ingresosFiltrados = ingresos.filter(item => {
    const tipoItem = obtenerTipoReal(item);
    const cumpleTipo = filtroTipo === 'Todos' ? true : tipoItem === filtroTipo;
    const cumpleMetodo = filtroMetodo === 'Todos' ? true : item.tipo?.toLowerCase() === filtroMetodo.toLowerCase();

    return cumpleTipo && cumpleMetodo;
  });

  // ==========================================
  // CÁLCULO DE LAS TARJETAS (RESUMEN)
  // ==========================================
  const totales = ingresosFiltrados.reduce((acc, item) => {
    const montoNum = Number(item.monto || 0);
    acc.total += montoNum;

    const tipoReal = obtenerTipoReal(item);

    switch (tipoReal) {
      case 'Servicio':
        acc.servicios += montoNum;
        break;
      case 'Producto':
        acc.productos += montoNum;
        break;
      case 'Mixto':
        acc.servicios += montoNum / 2;
        acc.productos += montoNum / 2;
        break;
      case 'Extra':
        acc.extra += montoNum;
        break;
      default:
        break;
    }

    return acc;
  }, {
    total: 0,
    servicios: 0,
    productos: 0,
    extra: 0
  });

  const handleVerDetalle = (ingreso) => {
    let desgloseServicios = 0;
    let desgloseProductos = 0;

    if (ingreso.ventas?.detalle_venta) {
      ingreso.ventas.detalle_venta.forEach(d => {
        const sub = Number(d.subtotal || 0);
        if (d.tipo?.toLowerCase() === 'producto') desgloseProductos += sub;
        if (d.tipo?.toLowerCase() === 'servicio') desgloseServicios += sub;
      });
    }

    setSelectedIngreso({
      ...ingreso,
      tipoReal: obtenerTipoReal(ingreso),
      desgloseServicios,
      desgloseProductos
    });
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-light tracking-widest uppercase text-black dark:text-white">
          Ingresos <span className={theme.gold}>|</span>
        </h1>

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
          {/* CALENDARIO CONECTADO DIRECTAMENTE A SUPABASE */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60 flex items-center gap-1">
              <Calendar size={12} className={theme.gold} /> Día Específico
            </label>
            <input 
              type="date" 
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:border-[#D4AF37] dark:text-white text-black font-medium" 
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
              <option value="Mixto">Mixto</option>
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
              <option value="efectivo">Efectivo</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <button 
            onClick={limpiarFiltros}
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity pb-2"
          >
            <RotateCcw size={14} /> Reajustar Filtros
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
                <th className="p-4 text-[11px] uppercase tracking-widest font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {ingresosFiltrados.map((row) => {
                const tipoReal = obtenerTipoReal(row);
                const fechaBase = row.ventas?.fecha || row.fecha;

                const fechaFormateada = fechaBase
                  ? new Date(fechaBase).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })
                  : 'Sin fecha';

                const badgeEstilos = {
                  'Servicio': 'bg-blue-900/20 text-blue-400',
                  'Producto': 'bg-emerald-900/20 text-emerald-400',
                  'Mixto': 'bg-amber-900/20 text-amber-400',
                  'Extra': 'bg-purple-900/20 text-purple-400'
                };

                return (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4 text-sm font-light">{fechaFormateada}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${badgeEstilos[tipoReal] || 'bg-gray-900/20 text-gray-400'}`}>
                        {tipoReal}
                      </span>
                    </td>
                    <td className="p-4 text-sm opacity-80">
                      {row.descripcion && row.descripcion !== 'mixto'
                        ? row.descripcion 
                        : `Venta registrada de ${row.ventas?.nombre_cliente || 'Cliente'}`}
                    </td>
                    <td className={`p-4 text-sm font-semibold ${theme.gold}`}>
                      S/ {Number(row.monto).toFixed(2)}
                    </td>
                    <td className="p-4 text-sm font-light italic text-gray-600 dark:text-gray-400">
                      {row.tipo}
                    </td>

                    <td className="p-4 text-sm text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleVerDetalle(row)}
                        className="text-gray-400 hover:text-[#D4AF37] transition-colors p-1"
                        title="Ver Desglose Especifico"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => handleAbirEdicion(row)}
                        className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                        title="Corregir datos de venta"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {ingresosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm opacity-40">No hay registros para este día</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL INGRESO EXTRA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#141414] w-full max-w-md p-6 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light uppercase tracking-widest text-black dark:text-white">
                Registrar Ingreso Extra
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="opacity-50 hover:opacity-100">
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
                  placeholder="Ej: Propina, Alquiler de espacio, etc."
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
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border border-gray-300 dark:border-gray-700 py-2 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`w-1/2 ${theme.goldBg} text-black py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110`}
                >
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#141414] w-full max-w-md p-6 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-light uppercase tracking-widest text-black dark:text-white">
                Corregir Datos del Ingreso
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="opacity-50 hover:opacity-100">
                <X size={20} />
              </button>
            </div>

            {esVenta && (
              <div className="mb-4 bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 p-3 rounded-sm text-xs flex gap-2 items-start">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  Este monto proviene de una venta enlazada. Para cambiar el valor económico, edítalo desde el módulo de <strong>Ventas</strong> para mantener el stock y desglose cuadrado.
                </span>
              </div>
            )}

            <form onSubmit={handleUpdateIngreso} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">
                  Monto (S/) {esVenta && <span className="text-red-400">(Bloqueado)</span>}
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  disabled={esVenta}
                  value={editMonto}
                  onChange={(e) => setEditMonto(e.target.value)}
                  className={`w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-xl focus:outline-none ${
                    esVenta ? 'opacity-40 cursor-not-allowed border-dashed' : 'focus:border-[#D4AF37]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Descripción / Concepto</label>
                <input 
                  type="text" 
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-60">Método de Pago</label>
                <select 
                  value={editMetodo}
                  onChange={(e) => setEditMetodo(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:border-[#D4AF37] dark:bg-[#141414]"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 border border-gray-300 dark:border-gray-700 py-2 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`w-1/2 ${theme.goldBg} text-black py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110`}
                >
                  Actualizar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE ESPECÍFICO DEL INGRESO */}
      {isDetailModalOpen && selectedIngreso && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#141414] w-full max-w-md p-6 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-sm">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-md font-medium uppercase tracking-widest text-black dark:text-white">
                Detalle del Ingreso
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="opacity-50 hover:opacity-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] uppercase tracking-widest opacity-50">Concepto / Descripción</span>
                <p className="text-sm font-normal mt-0.5">
                  {selectedIngreso.descripcion && selectedIngreso.descripcion !== 'mixto'
                    ? selectedIngreso.descripcion 
                    : `Venta de productos/servicios`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Origen / Cliente</span>
                  <p className="text-sm font-normal mt-0.5">
                    {selectedIngreso.ventas?.nombre_cliente || 'Ingreso Extra Externo'}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Código Venta</span>
                  <p className="text-sm font-light font-mono mt-0.5 text-[#D4AF37]">
                    {selectedIngreso.codigo_venta || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-b border-gray-100 dark:border-gray-800 py-3 my-2 space-y-2">
                <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Desglose Específico</span>
                
                {selectedIngreso.tipoReal === 'Extra' ? (
                  <div className="flex justify-between text-sm py-1">
                    <span className="opacity-70">Monto Único (Extra):</span>
                    <span className="font-medium">S/ {Number(selectedIngreso.monto).toFixed(2)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Por Servicios:
                      </span>
                      <span className="font-medium">S/ {selectedIngreso.desgloseServicios.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Por Productos:
                      </span>
                      <span className="font-medium">S/ {selectedIngreso.desgloseProductos.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Método de Pago</span>
                  <p className="text-xs italic opacity-80">{selectedIngreso.tipo}</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Monto Total Cobrado</span>
                  <p className={`text-xl font-bold ${theme.gold}`}>S/ {Number(selectedIngreso.monto).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full border border-gray-300 dark:border-gray-700 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Ingresos;
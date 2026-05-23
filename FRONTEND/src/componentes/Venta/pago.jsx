import React, { useMemo, useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { BoletaPDF } from './pdf/pdf';
import { Wallet, Banknote, Smartphone, CreditCard, Layers, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const METODOS = ['efectivo', 'yape', 'plin', 'tarjeta'];

const PaymentModule = ({
  total,
  subtotal,
  descuento,
  ventaActiva,
  onConfirmar,
  onCancelar
}) => {
  const [metodo, setMetodo] = useState('efectivo');
  const [montoPago, setMontoPago] = useState('');
  const [pagosMixtos, setPagosMixtos] = useState([{ tipo: 'efectivo', monto: '' }]);
  
  // Estado para las mini notificaciones (Toasts)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Efecto para limpiar la notificación automáticamente después de 4 segundos
  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo });
  };

  const totalConComisionGeneral = useMemo(() => {
    return metodo === 'tarjeta' ? total * 1.05 : total;
  }, [metodo, total]);

  const cambio = useMemo(() => {
    return Number(montoPago || 0) - totalConComisionGeneral;
  }, [montoPago, totalConComisionGeneral]);

  const resumenMixto = useMemo(() => {
    let abonoReal = 0, totalCobrado = 0, totalComisiones = 0;
    const detalle = pagosMixtos.map(pago => {
      const monto = Number(pago.monto || 0);
      let real = monto, comision = 0;
      if (pago.tipo === 'tarjeta') {
        real = monto / 1.05;
        comision = monto - real;
      }
      abonoReal += real; totalCobrado += monto; totalComisiones += comision;
      return { ...pago, abonoReal: real, comision };
    });

    const faltanteReal = total - abonoReal;
    const excedente = abonoReal > total ? abonoReal - total : 0;
    return { detalle, abonoReal, totalCobrado, totalComisiones, faltanteReal, excedente };
  }, [pagosMixtos, total]);

  const metodosUsados = pagosMixtos.map(p => p.tipo);

  const actualizarPago = (index, campo, valor) => {
    const copia = [...pagosMixtos];
    copia[index][campo] = valor;
    setPagosMixtos(copia);
  };

  const agregarMetodoMixto = () => {
    const disponibles = METODOS.filter(m => !metodosUsados.includes(m));
    if (disponibles.length === 0) return;
    setPagosMixtos(prev => [...prev, { tipo: disponibles[0], monto: '' }]);
  };

  const eliminarMetodo = (index) => {
    setPagosMixtos(prev => prev.filter((_, i) => i !== index));
  };

  const limpiarFormulario = () => {
    setMetodo('efectivo'); setMontoPago('');
    setPagosMixtos([{ tipo: 'efectivo', monto: '' }]);
  };

  const guardarVenta = async () => {
    try {
      const codigoVenta = `VENTA-${Date.now()}`;

      const cliente_id =
        ventaActiva.cliente && ventaActiva.cliente.id !== 'manual'
          ? ventaActiva.cliente.id
          : null;

      const nombre_cliente =
        ventaActiva.cliente ? ventaActiva.cliente.nombre : 'Cliente general';

      // 1. Guardar Cabecera de Venta
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([
          {
            codigo_venta: codigoVenta,
            fecha: new Date(),
            monto_total: total,
            cliente_id,
            nombre_cliente
          }
        ])
        .select()
        .single();

      if (ventaError) throw ventaError;

      // 2. Armar Detalles
      const detalles = [
        ...ventaActiva.productos.map(p => ({
          codigo_venta: codigoVenta,
          tipo: 'producto',
          id_producto: p.id,
          id_servicio: null,
          cantidad: p.cantidad,
          precio_unitario: p.precio,
          descuento: 0,
          subtotal: p.precio * p.cantidad,
          nombre: p.nombre 
        })),

        ...ventaActiva.servicios.map(s => ({
          codigo_venta: codigoVenta,
          tipo: 'servicio',
          id_producto: null,
          id_servicio: s.id,
          cantidad: s.cantidad,
          precio_unitario: s.precio,
          descuento: 0,
          subtotal: s.precio * s.cantidad,
          nombre: s.nombre 
        }))
      ];

      if (descuento > 0 && detalles.length > 0) {
        const descuentoPorItem = descuento / detalles.length;
        detalles.forEach(d => {
          d.descuento = descuentoPorItem;
          d.subtotal = d.subtotal - descuentoPorItem;
        });
      }

      const detallesParaBD = detalles.map(({ nombre, ...resto }) => resto);
      const { error: detalleError } = await supabase
        .from('detalle_venta')
        .insert(detallesParaBD);

      if (detalleError) throw detalleError;
if (ventaActiva.productos.length > 0) {
        // Mapeamos solo el ID y la cantidad elegida para pasárselo a la BD
        const productosParaStock = ventaActiva.productos.map(p => ({
          id: p.id,
          cantidad: p.cantidad
        }));

        const { error: stockError } = await supabase
          .rpc('restar_stock_venda', { productos_json: productosParaStock });

        if (stockError) throw stockError;
      }
      // 3. Armar e Insertar Pagos
      let pagos = [];
      if (metodo === 'mixto') {
        pagos = pagosMixtos.map(p => ({
          codigo_venta: codigoVenta,
          tipo: p.tipo,
          descripcion: 'mixto',
          monto: Number(p.monto)
        }));
      } else {
        pagos = [
          {
            codigo_venta: codigoVenta,
            tipo: metodo,
            descripcion: null,
            monto: Number(montoPago || totalConComisionGeneral)
          }
        ];
      }

      const { error: pagoError } = await supabase.from('pago').insert(pagos);
      if (pagoError) throw pagoError;

      // 4. Estructurar la información para la Boleta PDF
      const metodoPagoDetalle = metodo === 'mixto' 
        ? `Mixto (${pagosMixtos.map(p => `${p.tipo.toUpperCase()}: S/${p.monto}`).join(' + ')})`
        : metodo;

      const comisionTotal = metodo === 'mixto' 
        ? resumenMixto.totalComisiones 
        : (metodo === 'tarjeta' ? (total * 0.05) : 0);

      const infoBoleta = {
        nombreCliente: nombre_cliente,
        fecha: new Date().toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        metodoPago: metodoPagoDetalle,
        items: detalles.map(d => ({
          nombre: d.nombre || (d.tipo === 'producto' ? 'Producto' : 'Servicio'),
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.subtotal
        })),
        subtotal: subtotal,
        descuento: descuento,
        comision: comisionTotal,
        totalFinal: metodo === 'mixto' ? (total + comisionTotal) : totalConComisionGeneral
      };

      const doc = <BoletaPDF data={infoBoleta} />;
      const asBlob = await pdf(doc).toBlob();
      
      const url = URL.createObjectURL(asBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boleta_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      mostrarToast('Venta registrada y boleta descargada con éxito', 'success');
      limpiarFormulario();
      onConfirmar();

    } catch (error) {
      console.error(error);
      mostrarToast('Error al guardar la venta o generar el PDF', 'error');
    }
  };

  const handlePagar = async () => {
    if (metodo === 'mixto') {
      if (resumenMixto.faltanteReal > 0.01) {
        mostrarToast(`Falta cubrir S/ ${resumenMixto.faltanteReal.toFixed(2)}`, 'warning');
        return;
      }
    } else {
      const monto = Number(montoPago || 0);
      if (monto < totalConComisionGeneral) { 
        mostrarToast('Monto ingresado insuficiente', 'warning'); 
        return; 
      }
    }
    if (window.confirm('¿Confirmar pago y emitir boleta?')) { 
      await guardarVenta();
    }
  };

  return (
    <div className="relative max-w-2xl p-6 rounded-xl bg-white text-gray-800 border border-gray-200 dark:bg-[#121212] dark:text-white dark:border-zinc-800 shadow-2xl">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
          notificacion.tipo === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
          'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{notificacion.mensaje}</p>
          <button onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 self-start mb-4">
          <Wallet className="text-amber-500" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Módulo de Pago</h2>
        </div>
        <p className="text-gray-500 text-sm mb-1">Total Neto</p>
        <h1 className="text-4xl font-bold text-amber-500">
          S/ {metodo === 'mixto' ? (total + resumenMixto.totalComisiones).toFixed(2) : totalConComisionGeneral.toFixed(2)}
        </h1>
      </div>

      {/* MÉTODOS */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {METODOS.map(m => (
          <button key={m} onClick={() => setMetodo(m)} className={`py-3 rounded-xl transition-all ${metodo === m ? 'bg-amber-500 text-white scale-105' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
            <div className="flex flex-col items-center gap-1 text-xs font-bold capitalize">
              {m === 'efectivo' && <Banknote size={18}/>}
              {(m === 'yape' || m === 'plin') && <Smartphone size={18}/>}
              {m === 'tarjeta' && <CreditCard size={18}/>}
              {m}
            </div>
          </button>
        ))}
      </div>

      {/* MIXTO BUTTON */}
      <button onClick={() => setMetodo('mixto')} className={`w-full py-3 rounded-xl mb-6 border-2 transition-all ${metodo === 'mixto' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-transparent bg-zinc-100 dark:bg-zinc-800'}`}>
        <div className="flex items-center justify-center gap-2 font-bold"><Layers size={18}/> Pago Mixto</div>
      </button>

      {/* SIMPLE PANEL */}
      {metodo !== 'mixto' && (
        <div className="space-y-4 mb-6">
          <input type="number" placeholder="Ingresar monto" value={montoPago} onChange={(e) => setMontoPago(e.target.value)} className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-2xl font-mono"/>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-400">Abono real</p>
              <p className="text-xl font-bold">S/ {metodo === 'tarjeta' ? (Number(montoPago) / 1.05).toFixed(2) : Number(montoPago || 0).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{cambio >= 0 ? 'Vuelto' : 'Faltante'}</p>
              <h2 className={`text-3xl font-bold ${cambio >= 0 ? 'text-green-500' : 'text-red-500'}`}>S/ {Math.abs(cambio).toFixed(2)}</h2>
            </div>
          </div>
        </div>
      )}

      {/* MIXTO PANEL */}
      {metodo === 'mixto' && (
        <div className="space-y-4 mb-6">
          {resumenMixto.detalle.map((pago, index) => (
            <div key={index} className="rounded-xl p-4 bg-zinc-100 dark:bg-zinc-900">
              <div className="flex gap-2 items-center mb-3">
                <select value={pago.tipo} onChange={(e) => actualizarPago(index, 'tipo', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-zinc-800">
                  {METODOS.filter(m => !metodosUsados.includes(m) || m === pago.tipo).map(m => (
                    <option key={m} value={m}>{m === 'tarjeta' ? 'Tarjeta (+5%)' : m}</option>
                  ))}
                </select>
                <input type="number" placeholder="Monto" value={pago.monto} onChange={(e) => actualizarPago(index, 'monto', e.target.value)} className="flex-1 p-3 rounded-xl bg-white dark:bg-zinc-800"/>
                {pagosMixtos.length > 1 && (
                  <button onClick={() => eliminarMetodo(index)} className="text-red-400"><X size={20}/></button>
                )}
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Abono real</span>
                  <span className="font-bold text-green-500">S/ {pago.abonoReal.toFixed(2)}</span>
                </div>
                {pago.tipo === 'tarjeta' && (
                  <div className="flex justify-between">
                    <span>Comisión</span>
                    <span className="text-red-400 font-bold">S/ {pago.comision.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {pagosMixtos.length < METODOS.length && (
            <button onClick={agregarMetodoMixto} className="w-full py-2 rounded-xl border border-dashed border-gray-500 text-gray-500">+ Agregar método</button>
          )}

          {/* RESUMEN */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex justify-between">
              <span>Deuda cubierta</span>
              <span className="font-bold">S/ {resumenMixto.abonoReal.toFixed(2)} / S/ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total cobrado</span>
              <span className="font-bold">S/ {resumenMixto.totalCobrado.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Comisiones</span>
              <span className="text-red-400 font-bold">S/ {resumenMixto.totalComisiones.toFixed(2)}</span>
            </div>
            {resumenMixto.faltanteReal > 0 ? (
              <div className="flex items-center gap-2 text-amber-500">
                <AlertCircle size={16}/><p className="text-sm">Faltan: <b>S/ {resumenMixto.faltanteReal.toFixed(2)}</b></p>
              </div>
            ) : (
              <div className="text-green-500 font-bold text-center">¡Pago completo!</div>
            )}
          </div>
        </div>
      )}

      {/* BOTONES ACCIÓN */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-800">
        <button onClick={() => { if (window.confirm('¿Cancelar pago?')) { limpiarFormulario(); onCancelar(); } }} className="py-4 rounded-xl font-bold text-gray-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Cancelar
        </button>
        <button onClick={handlePagar} className="py-4 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-400">
          <div className="flex items-center justify-center gap-2"><CheckCircle size={18}/>Confirmar</div>
        </button>
      </div>
    </div>
  );
};

export default PaymentModule;
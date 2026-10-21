import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase'; 

// Subcomponentes
import Notificacion from './include/Notificacion';
import HeaderCierre from './include/HeaderCierre';
import TarjetasResumen from './include/TarjetasResumen';
import TablaCuadre from './include/TablaCuadre';
import DictamenCuadre from './include/DictamenCuadre';
import EstadoCajaCerrada from './include/EstadoCajaCerrada';
import SeccionExtras from './include/SeccionExtras';

const obtenerFechaHoyLocal = () => {
  const hoy = new Date();
  const offset = hoy.getTimezoneOffset() * 60000;
  return new Date(hoy.getTime() - offset).toISOString().split('T')[0];
};

const CierreCaja = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaHoyLocal());
  const [loading, setLoading] = useState(true);
  const [baseInicial, setBaseInicial] = useState(0);
  const [cajaCerrada, setCajaCerrada] = useState(false);
  const [hayNuevosMovimientos, setHayNuevosMovimientos] = useState(false);

  const [datosSistema, setDatosSistema] = useState({
    ingresos: 0,
    ingresosExtras: 0,
    egresos: 0,
    metodos: { efectivo: 0, yape: 0, plin: 0, tarjeta: 0 }
  });

  const [valoresContados, setValoresContados] = useState({
    efectivo: '', yape: '', plin: '', tarjeta: ''
  });

  const [notificacion, setNotificacion] = useState({
    visible: false, mensaje: '', tipo: 'success'
  });

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Consultar rango amplio para evitar desfases UTC
        const { data: pagos, error: errorPagos } = await supabase
          .from('pago')
          .select('monto, tipo, codigo_venta, fecha');

        if (errorPagos) throw errorPagos;

        const { data: egresosData, error: errorEgresos } = await supabase
          .from('egresos')
          .select('monto, metodo_pago, fecha');

        if (errorEgresos) throw errorEgresos;

        const metodosAcumulados = { efectivo: 0, yape: 0, plin: 0, tarjeta: 0 };
        let sumaIngresosVentas = 0;
        let sumaIngresosExtras = 0;
        let sumaEgresosTotal = 0;

        // Filtrar localmente por la cadena YYYY-MM-DD seleccionada
        const pagosDelDia = (pagos || []).filter(p => p.fecha && p.fecha.startsWith(fechaSeleccionada));
        const egresosDelDia = (egresosData || []).filter(e => e.fecha && e.fecha.startsWith(fechaSeleccionada));

        // A. PROCESAR INGRESOS Y ASIGNAR A CANALES
        pagosDelDia.forEach((pago) => {
          const monto = Number(pago.monto || 0);
          const esExtra = !pago.codigo_venta;

          if (esExtra) {
            sumaIngresosExtras += monto;
          } else {
            sumaIngresosVentas += monto;
          }

          const metodoKey = (pago.tipo || '').toString().trim().toLowerCase();
          
          if (metodoKey.includes('efectivo')) metodosAcumulados.efectivo += monto;
          else if (metodoKey.includes('yape')) metodosAcumulados.yape += monto;
          else if (metodoKey.includes('plin')) metodosAcumulados.plin += monto;
          else if (metodoKey.includes('tarjeta')) metodosAcumulados.tarjeta += monto;
          else metodosAcumulados.efectivo += monto;
        });

        // B. PROCESAR EGRESOS Y RESTAR DE CANALES
        egresosDelDia.forEach((egreso) => {
          const monto = Number(egreso.monto || 0);
          sumaEgresosTotal += monto;

          const metodoBruto = (egreso.metodo_pago || '').toString().trim().toLowerCase();

          if (metodoBruto.includes('efectivo')) metodosAcumulados.efectivo -= monto;
          else if (metodoBruto.includes('yape')) metodosAcumulados.yape -= monto;
          else if (metodoBruto.includes('plin')) metodosAcumulados.plin -= monto;
          else if (metodoBruto.includes('tarjeta')) metodosAcumulados.tarjeta -= monto;
          else metodosAcumulados.efectivo -= monto;
        });

        // C. VERIFICAR CIERRE EN HISTORIAL
        const { data: cierresData } = await supabase
          .from('cierre_caja')
          .select('id, fecha_cierre, ingresos_sistema, egresos_sistema');

        const cierreExistente = (cierresData || []).find(c => c.fecha_cierre && c.fecha_cierre.startsWith(fechaSeleccionada));

        if (isMounted) {
          const ingresoTotalCalculado = sumaIngresosVentas + sumaIngresosExtras;
          
          setDatosSistema({
            ingresos: sumaIngresosVentas,
            ingresosExtras: sumaIngresosExtras,
            egresos: sumaEgresosTotal,
            metodos: metodosAcumulados
          });

          if (cierreExistente) {
            const difIngresos = Math.abs((cierreExistente.ingresos_sistema || 0) - ingresoTotalCalculado);
            const difEgresos = Math.abs((cierreExistente.egresos_sistema || 0) - sumaEgresosTotal);

            const hayNovedades = difIngresos > 0.01 || difEgresos > 0.01;

            setCajaCerrada(true);
            setHayNuevosMovimientos(hayNovedades);
          } else {
            setCajaCerrada(false);
            setHayNuevosMovimientos(false);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error('Error cargando datos de cierre:', error.message);
        if (isMounted) setLoading(false);
      }
    };

    cargarDatos();
    return () => { isMounted = false; };
  }, [fechaSeleccionada]);

  // CÁLCULOS GLOBALES
  const ingresoTotalBruto = datosSistema.ingresos + datosSistema.ingresosExtras;
  const gananciaDia = ingresoTotalBruto - datosSistema.egresos;
  const saldoCajaEsperado = Number(baseInicial) + ingresoTotalBruto - datosSistema.egresos;

  const handleInputChange = (metodo, valor) => {
    setValoresContados(prev => ({ ...prev, [metodo]: valor }));
  };

  const diferenciaTotalGlobal = Object.keys(datosSistema.metodos).reduce((acc, metodo) => {
    const contado = parseFloat(valoresContados[metodo]) || 0;
    const esperado = datosSistema.metodos[metodo];
    const esperadoRealCanal = metodo === 'efectivo' ? esperado + Number(baseInicial) : esperado;
    return acc + (contado - esperadoRealCanal);
  }, 0);

  // GUARDAR / ACTUALIZAR CIERRE
  const handleCerrarCaja = async () => {
    try {
      const fechaCierreLocal = `${fechaSeleccionada}T${new Date().toLocaleTimeString('es-PE', { hour12: false })}`;

      
const { data: cierresData, error: errorCierres } = await supabase
  .from('cierre_caja')
  .select('id, fecha_cierre, ingresos_sistema, egresos_sistema')
  .gte('fecha_cierre', `${fechaSeleccionada}T00:00:00`)
  .lt('fecha_cierre', `${fechaSeleccionada}T23:59:59.999`)
  .order('fecha_cierre', { ascending: false });

if (errorCierres) throw errorCierres;

const cierreExistente = cierresData?.[0] || null;

      const payload = {
        fecha_cierre: fechaCierreLocal,
        base_inicial: Number(baseInicial),
        ingresos_sistema: ingresoTotalBruto,
        egresos_sistema: datosSistema.egresos,
        efectivo_contado: parseFloat(valoresContados.efectivo) || 0,
        yape_contado: parseFloat(valoresContados.yape) || 0,
        plin_contado: parseFloat(valoresContados.plin) || 0,
        tarjeta_contado: parseFloat(valoresContados.tarjeta) || 0,
        estado: 'cerrado'
      };

      let error;

      if (cierreExistente) {
        ({ error } = await supabase
          .from('cierre_caja')
          .update(payload)
          .eq('id', cierreExistente.id));
      } else {
        ({ error } = await supabase
          .from('cierre_caja')
          .insert([payload]));
      }

      if (error) throw error;

      setCajaCerrada(true);
      setHayNuevosMovimientos(false);
      mostrarNotificacion('¡Cierre de caja actualizado correctamente!', 'success');
    } catch (error) {
      console.error('Error guardando el cierre:', error.message);
      mostrarNotificacion('Error al guardar el cierre de caja.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Notificacion notificacion={notificacion} />

      <HeaderCierre
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        cajaCerrada={cajaCerrada}
        setCajaCerrada={setCajaCerrada}
        setLoading={setLoading}
        setValoresContados={setValoresContados}
        setBaseInicial={setBaseInicial}
        onCerrarCaja={handleCerrarCaja}
      />

      <TarjetasResumen
        datosSistema={datosSistema}
        gananciaDia={gananciaDia}
        baseInicial={baseInicial}
        setBaseInicial={setBaseInicial}
      />

      {loading ? (
        <div className="p-10 text-center uppercase tracking-widest text-sm opacity-50">
          Calculando montos del sistema...
        </div>
      ) : cajaCerrada ? (
        <EstadoCajaCerrada 
          fechaSeleccionada={fechaSeleccionada} 
          hayNuevosMovimientos={hayNuevosMovimientos}
          onReabrirCaja={() => setCajaCerrada(false)}
        />
      ) : (
        <div className="space-y-8">
          <SeccionExtras 
            ingresosExtras={datosSistema.ingresosExtras} 
            egresos={datosSistema.egresos} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <TablaCuadre
                metodos={datosSistema.metodos}
                valoresContados={valoresContados}
                onInputChange={handleInputChange}
                baseInicial={baseInicial}
              />
            </div>
            <div className="lg:col-span-4">
              <DictamenCuadre
                saldoCajaEsperado={saldoCajaEsperado}
                diferenciaTotalGlobal={diferenciaTotalGlobal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CierreCaja;
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Coins
} from 'lucide-react';
import { supabase } from '../../../lib/supabase'; 

const CierreCaja = () => {
  const theme = {
    gold: 'text-[#D4AF37]',
    goldBg: 'bg-[#D4AF37]',
    goldBorder: 'border-[#D4AF37]',
  };

  // 1. ESTADOS PRINCIPALES
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0] // Fecha de hoy por defecto (YYYY-MM-DD)
  );
  const [loading, setLoading] = useState(true);
  const [baseInicial, setBaseInicial] = useState(0); // Monto inicial editable

  // Valores calculados por el sistema para ese día (Claves en minúsculas)
  const [datosSistema, setDatosSistema] = useState({
    ingresos: 0,
    egresos: 0,
    metodos: {
      efectivo: 0,
      yape: 0,
      plin: 0,
      tarjeta: 0
    }
  });

  // 2. ESTADOS DEL FORMULARIO DE CUADRE (Valores ingresados por el cajero)
  const [valoresContados, setValoresContados] = useState({
    efectivo: '',
    yape: '',
    plin: '',
    tarjeta: ''
  });

  // ==========================================
  // 3. CONSULTA MULTIPLE A SUPABASE
  // ==========================================
  const fetchDatosDelDia = async () => {
    setLoading(true);
    try {
      const inicioLocal = new Date(`${fechaSeleccionada}T00:00:00`);
const finLocal = new Date(`${fechaSeleccionada}T23:59:59`);

const inicioDia = inicioLocal.toISOString();
const finDia = finLocal.toISOString();

      // A. Traer todos los pagos usando la columna correcta 'fecha'
      const { data: pagos, error: errorPagos } = await supabase
        .from('pago')
        .select('monto, tipo')
        .gte('fecha', inicioDia)
        .lte('fecha', finDia);

      if (errorPagos) throw errorPagos;

      // B. Traer todos los egresos del mismo rango de fecha
      const { data: egresosData, error: errorEgresos } = await supabase
        .from('egresos')
        .select('monto')
        .gte('fecha', inicioDia)
        .lte('fecha', finDia);

      if (errorEgresos) throw errorEgresos;

      // C. Procesar y acumular montos en el estado
      const sumaEgresos = egresosData?.reduce((acc, curr) => acc + Number(curr.monto || 0), 0) || 0;
      
      let sumaIngresos = 0;
      const metodosAcumulados = { efectivo: 0, yape: 0, plin: 0, tarjeta: 0 };

      pagos?.forEach(pago => {
        const monto = Number(pago.monto || 0);
        sumaIngresos += monto;
        
        const metodoKey = pago.tipo?.toLowerCase();
        if (metodosAcumulados[metodoKey] !== undefined) {
          metodosAcumulados[metodoKey] += monto;
        }
      });

      setDatosSistema({
        ingresos: sumaIngresos,
        egresos: sumaEgresos,
        metodos: metodosAcumulados
      });

    } catch (error) {
      console.error('Error cargando datos de cierre:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatosDelDia();
  }, [fechaSeleccionada]);

  // ==========================================
  // 4. CALCULOS DERIVADOS DE GANANCIA Y DIFERENCIAS
  // ==========================================
  const gananciaDia = datosSistema.ingresos - datosSistema.egresos;
  const saldoCajaEsperado = Number(baseInicial) + datosSistema.ingresos - datosSistema.egresos;

  // Manejar el cambio en los inputs de validación física
  const handleInputChange = (metodo, valor) => {
    setValoresContados(prev => ({
      ...prev,
      [metodo]: valor
    }));
  };

  // Calcular diferencias método por método
  const calcularDiferencia = (metodo) => {
    const contado = parseFloat(valoresContados[metodo]) || 0;
    const esperado = datosSistema.metodos[metodo];
    return contado - esperado;
  };

  // Calcular diferencia total global
  const diferenciaTotalGlobal = Object.keys(datosSistema.metodos).reduce((acc, metodo) => {
    const contado = parseFloat(valoresContados[metodo]) || 0;
    const esperado = datosSistema.metodos[metodo];
    return acc + (contado - esperado);
  }, 0);

  // ==========================================
  // 5. ACCIÓN FINAL: GUARDAR EL CIERRE EN SUPABASE
  // ==========================================
  const handleCerrarCaja = async () => {
    try {
      const { error } = await supabase
        .from('cierre_caja')
        .insert([
          {
            fecha_cierre: new Date().toISOString(),
            base_inicial: Number(baseInicial),
            ingresos_sistema: datosSistema.ingresos,
            egresos_sistema: datosSistema.egresos,
            efectivo_contado: parseFloat(valoresContados.efectivo) || 0,
            yape_contado: parseFloat(valoresContados.yape) || 0,       // Nueva columna
            plin_contado: parseFloat(valoresContados.plin) || 0,       // Nueva columna
            tarjeta_contado: parseFloat(valoresContados.tarjeta) || 0,   // Nueva columna
            estado: 'cerrado'
            // Omitimos 'diferencia' si es una columna calculada automáticamente en la BD
          }
        ]);

      if (error) throw error;
      
      alert('¡Caja cerrada con éxito y guardada en el historial!');
      
      // Limpiar los campos del formulario tras un cierre exitoso
      setBaseInicial(0);
      setValoresContados({
        efectivo: '',
        yape: '',
        plin: '',
        tarjeta: ''
      });

      // Refrescar los datos de la pantalla para reflejar los cambios limpios
      fetchDatosDelDia();

    } catch (error) {
      console.error('Error al efectuar el cierre:', error.message);
      alert('Hubo un error al guardar el cierre en la base de datos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] p-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between gap-6 mb-12 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-light tracking-[0.25em] uppercase text-black dark:text-white">
            Cierre de Caja <span className={theme.gold}>.</span>
          </h1>

          <div className="flex items-center gap-2 mt-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-sm shadow-xs">
            <Calendar size={14} className={theme.gold} />
            <input 
              type="date" 
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-wider outline-none dark:text-white text-black font-medium" 
            />
          </div>
        </div>

        <button 
          onClick={handleCerrarCaja}
          className={`${theme.goldBg} text-black px-8 py-3 rounded-sm flex items-center gap-3 hover:scale-[1.02] transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-[#D4AF37]/10`}
        >
          <Lock size={16} />
          Finalizar y Cerrar Caja
        </button>
      </header>

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-gray-300 dark:border-gray-700 shadow-xl rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-widest text-gray-500">Ingresos Totales</p>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">S/ {datosSistema.ingresos.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-rose-500/50 shadow-xl rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-widest text-gray-500">Egresos Totales</p>
            <TrendingDown className="text-rose-500" size={20} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">- S/ {datosSistema.egresos.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-[#D4AF37] shadow-xl rounded-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-widest text-gray-500">Ganancia Neta (Día)</p>
            <Wallet className={theme.gold} size={20} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">S/ {gananciaDia.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-blue-500/50 shadow-xl rounded-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs uppercase tracking-widest text-gray-500">Base Apertura</p>
            <Coins className="text-blue-400" size={20} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold opacity-70">S/</span>
            <input 
              type="number" 
              step="0.01"
              value={baseInicial} 
              onChange={(e) => setBaseInicial(e.target.value)}
              className="text-2xl font-semibold tracking-tight bg-transparent border-b border-dashed border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-400 w-full"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN DE CUADRE MÈTODO POR MÉTODO */}
      {loading ? (
        <div className="p-10 text-center uppercase tracking-widest text-sm opacity-50">Calculando montos del sistema...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* TABLA IZQUIERDA: VALIDACIÓN DETALLADA */}
          <div className="lg:col-span-8 bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm overflow-hidden">
            <div className="p-5 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <ArrowRightLeft size={16} className={theme.gold} />
              <h4 className="text-xs uppercase tracking-widest font-semibold">Desglose e Inspección de Canales</h4>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-widest opacity-60">
                  <th className="p-4">Método</th>
                  <th className="p-4 text-right">Monto en Sistema</th>
                  <th className="p-4 text-center w-48">Monto Apps/Real Contado (S/)</th>
                  <th className="p-4 text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {Object.keys(datosSistema.metodos).map((metodo) => {
                  const dif = calcularDiferencia(metodo);
                  return (
                    <tr key={metodo} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium uppercase tracking-wider text-xs opacity-80">{metodo}</td>
                      <td className="p-4 text-right font-light">S/ {datosSistema.metodos[metodo].toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={valoresContados[metodo]}
                          onChange={(e) => handleInputChange(metodo, e.target.value)}
                          className="w-32 bg-gray-50 dark:bg-[#1f1f1f] border-b border-gray-300 dark:border-gray-700 px-2 py-1 text-right focus:outline-none focus:border-[#D4AF37] font-semibold text-black dark:text-white"
                        />
                      </td>
                      <td className={`p-4 text-right font-bold ${dif === 0 ? 'opacity-40' : dif > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {dif === 0 ? 'S/ 0.00' : `${dif > 0 ? '+' : ''} S/ ${dif.toFixed(2)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RESUMEN DERECHO: DICTAMEN DE CAJA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#141414] p-6 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-4 flex gap-2 font-semibold">
                  <CheckCircle2 size={16} className={theme.gold} /> Dictamen de Cuadre
                </h4>
                
                <div className="space-y-3 text-sm border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex justify-between opacity-70">
                    <span>Esperado total en caja:</span>
                    <span>S/ {saldoCajaEsperado.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic">
                    *(Suma ingresos + base inicial - egresos)
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Diferencia Neta Global</p>
                <div className={`p-4 rounded-sm text-center text-xl font-bold ${
                  diferenciaTotalGlobal === 0 
                    ? 'bg-gray-500/10 text-gray-400' 
                    : diferenciaTotalGlobal > 0 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-400'
                }`}>
                  S/ {diferenciaTotalGlobal.toFixed(2)}
                </div>

                {diferenciaTotalGlobal !== 0 && (
                  <div className="text-amber-500 text-xs mt-3 flex gap-2 items-center justify-center border border-amber-500/20 p-2 bg-amber-500/5">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>Se registrará un descuadre en el historial.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CierreCaja;
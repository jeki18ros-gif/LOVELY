import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Download, FileSpreadsheet, FileText, Search, TrendingUp, X } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { supabase } from '../../../lib/supabase';

const NOMBRES_MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const claveMes = (fecha) => {
  if (!fecha) return '';
  if (typeof fecha === 'string') return fecha.slice(0, 7);
  const date = new Date(fecha);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const claveFecha = (fecha) => {
  if (!fecha) return '';
  if (typeof fecha === 'string') return fecha.slice(0, 10);
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatoMoneda = (monto) => `S/ ${Number(monto || 0).toFixed(2)}`;
const textoConceptos = (items) => items.length
  ? items.map((item) => `${item.nombre} (x${item.cantidad})`).join(', ')
  : 'No pidió';

const estilosPDF = StyleSheet.create({
  pagina: { padding: 32, fontFamily: 'Helvetica', fontSize: 9, color: '#1f2937' },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  subtitulo: { fontSize: 9, color: '#64748b', marginBottom: 18 },
  seccion: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 8 },
  grafico: { height: 190, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#cbd5e1', marginBottom: 18 },
  columnaGrafico: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 2 },
  etiquetaGrafico: { fontSize: 7, textAlign: 'center', marginBottom: 4 },
  barra: { width: 22, backgroundColor: '#D4AF37' },
  nombreGrafico: { fontSize: 7, textAlign: 'center', marginTop: 5 },
  encabezadoTabla: { flexDirection: 'row', backgroundColor: '#e2e8f0', padding: 6, fontWeight: 'bold' },
  filaTabla: { flexDirection: 'row', padding: 6, borderBottomWidth: 0.5, borderBottomColor: '#cbd5e1' },
  celda: { flex: 1, paddingHorizontal: 2 },
  celdaFecha: { width: 58 },
  celdaCliente: { width: 100 },
  celdaMonto: { width: 72, textAlign: 'right' }
});

const crearMeses = (cantidad) => {
  const hoy = new Date();
  return Array.from({ length: cantidad }, (_, index) => {
    const date = new Date(hoy.getFullYear(), hoy.getMonth() - cantidad + index + 1, 1);
    return {
      key: claveMes(date),
      mes: NOMBRES_MESES[date.getMonth()],
      anio: date.getFullYear(),
      ingresos: 0,
      egresos: 0,
      ganancia: 0
    };
  });
};

export default function ProgresoMensual() {
  const [mesesVisibles, setMesesVisibles] = useState(5);
  const [tipoGrafico, setTipoGrafico] = useState('ganancia');
  const [mesConceptos, setMesConceptos] = useState(() => claveMes(new Date()));
  const [pagos, setPagos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoTabla, setTipoTabla] = useState('todos');
  const [modalPDF, setModalPDF] = useState(false);
  const [modalExcel, setModalExcel] = useState(false);
  const [incluirGraficoPDF, setIncluirGraficoPDF] = useState(true);
  const [incluirTablaPDF, setIncluirTablaPDF] = useState(true);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const cargarDatos = async () => {
      setLoading(true);
      setErrorCarga('');

      try {
        const [pagosResult, egresosResult, ventasResult, productosResult, serviciosResult] = await Promise.all([
          supabase.from('pago').select('monto, fecha, codigo_venta'),
          supabase.from('egresos').select('monto, fecha'),
          supabase.from('ventas').select(`
            codigo_venta,
            fecha,
            nombre_cliente,
            detalle_venta (tipo, id_producto, id_servicio, cantidad, subtotal)
          `).order('fecha', { ascending: false }),
          supabase.from('producto').select('id, nombre'),
          supabase.from('servicio').select('id, nombre')
        ]);

        const resultadoConError = [pagosResult, egresosResult, ventasResult, productosResult, serviciosResult]
          .find((result) => result.error);
        if (resultadoConError) throw resultadoConError.error;

        const nombresProductos = new Map((productosResult.data || []).map((item) => [String(item.id), item.nombre]));
        const nombresServicios = new Map((serviciosResult.data || []).map((item) => [String(item.id), item.nombre]));

        const ventasProcesadas = (ventasResult.data || []).map((venta) => {
          const conceptos = (venta.detalle_venta || []).reduce((acumulado, detalle) => {
            const esServicio = detalle.tipo?.toLowerCase() === 'servicio';
            const esProducto = detalle.tipo?.toLowerCase() === 'producto';
            if (!esServicio && !esProducto) return acumulado;

            const grupo = esServicio ? acumulado.servicios : acumulado.productos;
            const id = esServicio ? detalle.id_servicio : detalle.id_producto;
            const catalogo = esServicio ? nombresServicios : nombresProductos;
            const nombre = catalogo.get(String(id)) || (esServicio ? 'Servicio no disponible' : 'Producto no disponible');
            const existente = grupo.find((item) => item.nombre === nombre);

            if (existente) {
              existente.cantidad += Number(detalle.cantidad || 0);
              existente.monto += Number(detalle.subtotal || 0);
            } else {
              grupo.push({ nombre, cantidad: Number(detalle.cantidad || 0), monto: Number(detalle.subtotal || 0) });
            }
            return acumulado;
          }, { servicios: [], productos: [] });

          return {
            ...venta,
            fechaClave: claveFecha(venta.fecha),
            servicios: conceptos.servicios,
            productos: conceptos.productos,
            montoServicios: conceptos.servicios.reduce((total, item) => total + item.monto, 0),
            montoProductos: conceptos.productos.reduce((total, item) => total + item.monto, 0)
          };
        });

        if (!cancelado) {
          setPagos(pagosResult.data || []);
          setEgresos(egresosResult.data || []);
          setVentas(ventasProcesadas);
        }
      } catch (error) {
        console.error('Error cargando el progreso mensual:', error);
        if (!cancelado) setErrorCarga('No se pudieron cargar los movimientos financieros.');
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    cargarDatos();
    return () => { cancelado = true; };
  }, []);

  const meses = useMemo(() => {
    const resumen = crearMeses(mesesVisibles);
    const porClave = new Map(resumen.map((mes) => [mes.key, mes]));

    pagos.forEach((pago) => {
      const mes = porClave.get(claveMes(pago.fecha));
      if (mes) mes.ingresos += Number(pago.monto || 0);
    });

    egresos.forEach((egreso) => {
      const mes = porClave.get(claveMes(egreso.fecha));
      if (mes) mes.egresos += Number(egreso.monto || 0);
    });

    resumen.forEach((mes) => { mes.ganancia = mes.ingresos - mes.egresos; });
    return resumen;
  }, [pagos, egresos, mesesVisibles]);

  const ventasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');
    return ventas.filter((venta) => {
      if (fechaInicio && venta.fechaClave < fechaInicio) return false;
      if (fechaFin && venta.fechaClave > fechaFin) return false;
      if (tipoTabla === 'servicios' && venta.servicios.length === 0) return false;
      if (tipoTabla === 'productos' && venta.productos.length === 0) return false;
      if (!termino) return true;

      const conceptos = (tipoTabla === 'servicios' ? venta.servicios :
        tipoTabla === 'productos' ? venta.productos : [...venta.servicios, ...venta.productos])
        .map((item) => item.nombre);
      return [venta.nombre_cliente || 'Cliente general', ...conceptos]
        .some((texto) => texto.toLocaleLowerCase('es').includes(termino));
    });
  }, [ventas, busqueda, fechaInicio, fechaFin, tipoTabla]);

  const rankingConceptos = useMemo(() => {
    const esServicio = tipoGrafico === 'servicios';
    const totales = new Map();

    ventas.forEach((venta) => {
      if (venta.fechaClave.slice(0, 7) !== mesConceptos) return;
      const conceptos = esServicio ? venta.servicios : venta.productos;
      conceptos.forEach((item) => {
        const actual = totales.get(item.nombre) || { nombre: item.nombre, cantidad: 0, monto: 0 };
        actual.cantidad += item.cantidad;
        actual.monto += item.monto;
        totales.set(item.nombre, actual);
      });
    });

    return [...totales.values()].sort((a, b) => b.cantidad - a.cantidad);
  }, [ventas, tipoGrafico, mesConceptos]);

  const escala = Math.max(...meses.map((mes) => Math.abs(mes.ganancia)), 1);
  const maxCantidad = Math.max(...rankingConceptos.map((item) => item.cantidad), 1);
  const mesActual = claveMes(new Date());
  const limpiarFiltrosTabla = () => {
    setBusqueda('');
    setFechaInicio('');
    setFechaFin('');
    setTipoTabla('todos');
  };

  const columnasExportables = [
    { clave: 'Fecha', tipo: 'texto' },
    { clave: 'Cliente', tipo: 'texto' },
    ...(tipoTabla !== 'productos' ? [
      { clave: 'Servicio / cantidad', tipo: 'texto' },
      { clave: 'Monto servicio', tipo: 'monto' }
    ] : []),
    ...(tipoTabla !== 'servicios' ? [
      { clave: 'Producto / cantidad', tipo: 'texto' },
      { clave: 'Monto producto', tipo: 'monto' }
    ] : [])
  ];

  const filasExportables = ventasFiltradas.map((venta) => ({
    Fecha: venta.fechaClave ? venta.fechaClave.split('-').reverse().join('/') : '-',
    Cliente: venta.nombre_cliente || 'Cliente general',
    ...(tipoTabla !== 'productos' ? {
      'Servicio / cantidad': textoConceptos(venta.servicios),
      'Monto servicio': Number(venta.montoServicios || 0)
    } : {}),
    ...(tipoTabla !== 'servicios' ? {
      'Producto / cantidad': textoConceptos(venta.productos),
      'Monto producto': Number(venta.montoProductos || 0)
    } : {})
  }));

  const datosGraficoPDF = tipoGrafico === 'ganancia'
    ? meses.map((mes) => ({
      nombre: `${mes.mes} ${mes.anio}`,
      valor: mes.ganancia,
      etiqueta: formatoMoneda(mes.ganancia)
    }))
    : rankingConceptos.map((item) => ({
      nombre: item.nombre,
      valor: item.cantidad,
      etiqueta: `${item.cantidad} uds.`
    }));

  const descargarPDF = async () => {
    if (!incluirGraficoPDF && !incluirTablaPDF) return;
    setExportando(true);

    try {
      const maxGrafico = Math.max(...datosGraficoPDF.map((item) => Math.abs(item.valor)), 1);
      const tituloGrafico = tipoGrafico === 'ganancia' ? 'Ganancia neta por mes' :
        tipoGrafico === 'servicios' ? `Servicios realizados - ${mesConceptos}` : `Productos vendidos - ${mesConceptos}`;
      const documento = (
        <Document>
          <Page size="A4" orientation={incluirTablaPDF && columnasExportables.length > 4 ? 'landscape' : 'portrait'} style={estilosPDF.pagina}>
            <Text style={estilosPDF.titulo}>Reporte de progreso mensual</Text>
            <Text style={estilosPDF.subtitulo}>
              {`Gráfico: ${tipoGrafico} | Tabla: ${tipoTabla} | Registros: ${filasExportables.length}`}
            </Text>
            {incluirGraficoPDF && (
              <View>
                <Text style={estilosPDF.seccion}>{tituloGrafico}</Text>
                <View style={estilosPDF.grafico}>
                  {datosGraficoPDF.map((item, index) => (
                    <View key={`${item.nombre}-${index}`} style={estilosPDF.columnaGrafico}>
                      <Text style={estilosPDF.etiquetaGrafico}>{item.etiqueta}</Text>
                      <View style={[estilosPDF.barra, { height: `${Math.max((Math.abs(item.valor) / maxGrafico) * 125, 3)}pt` }]} />
                      <Text style={estilosPDF.nombreGrafico}>{item.nombre}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {incluirTablaPDF && (
              <View>
                <Text style={estilosPDF.seccion}>Ventas filtradas</Text>
                <View style={estilosPDF.encabezadoTabla} fixed>
                  {columnasExportables.map((columna) => (
                    <Text
                      key={columna.clave}
                      style={[
                        estilosPDF.celda,
                        columna.clave === 'Fecha' && estilosPDF.celdaFecha,
                        columna.clave === 'Cliente' && estilosPDF.celdaCliente,
                        columna.tipo === 'monto' && estilosPDF.celdaMonto
                      ]}
                    >
                      {columna.clave}
                    </Text>
                  ))}
                </View>
                {filasExportables.map((fila, index) => (
                  <View key={`${fila.Fecha}-${index}`} style={estilosPDF.filaTabla} wrap={false}>
                    {columnasExportables.map((columna) => (
                      <Text
                        key={columna.clave}
                        style={[
                          estilosPDF.celda,
                          columna.clave === 'Fecha' && estilosPDF.celdaFecha,
                          columna.clave === 'Cliente' && estilosPDF.celdaCliente,
                          columna.tipo === 'monto' && estilosPDF.celdaMonto
                        ]}
                      >
                        {columna.tipo === 'monto' ? formatoMoneda(fila[columna.clave]) : fila[columna.clave]}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </Page>
        </Document>
      );

      const blob = await pdf(documento).toBlob();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = 'progreso-mensual.pdf';
      enlace.click();
      URL.revokeObjectURL(url);
      setModalPDF(false);
    } catch (error) {
      console.error('Error generando el PDF:', error);
      window.alert('No se pudo generar el PDF.');
    } finally {
      setExportando(false);
    }
  };

  const descargarExcel = () => {
    try {
      const hoja = XLSX.utils.json_to_sheet(filasExportables, { header: columnasExportables.map((columna) => columna.clave) });
      hoja['!cols'] = columnasExportables.map((columna) => ({ wch: columna.clave.length > 18 ? 30 : 20 }));
      columnasExportables.forEach((columna, columnIndex) => {
        if (columna.tipo !== 'monto') return;
        filasExportables.forEach((_, rowIndex) => {
          const celda = hoja[XLSX.utils.encode_cell({ r: rowIndex + 1, c: columnIndex })];
          if (celda) celda.z = '"S/" #,##0.00';
        });
      });

      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Progreso mensual');
      XLSX.writeFile(libro, 'progreso-mensual.xlsx');
      setModalExcel(false);
    } catch (error) {
      console.error('Error generando el Excel:', error);
      window.alert('No se pudo generar el archivo Excel.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-slate-800 transition-colors dark:bg-[#141414] dark:text-slate-100">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Progreso mensual</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ganancia neta calculada con ingresos registrados menos egresos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setIncluirGraficoPDF(true);
              setIncluirTablaPDF(true);
              setModalPDF(true);
            }}
            disabled={loading || Boolean(errorCarga)}
            className="inline-flex items-center gap-2 rounded bg-rose-700 px-3 py-2 text-sm font-medium text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" /> PDF
          </button>
          <button
            type="button"
            onClick={() => setModalExcel(true)}
            disabled={loading || Boolean(errorCarga)}
            className="inline-flex items-center gap-2 rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </button>
        </div>
      </header>

      <section className="mb-8 rounded-lg border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-[#1c1c1c]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-lg font-semibold">
                {tipoGrafico === 'ganancia' ? 'Ganancia neta por mes' :
                  tipoGrafico === 'servicios' ? 'Servicios más realizados' : 'Productos más vendidos'}
              </h2>
            </div>
            <div className="inline-flex rounded border border-slate-300 p-0.5 dark:border-slate-700" role="group" aria-label="Tipo de gráfico">
              {[
                { value: 'ganancia', label: 'Ganancia' },
                { value: 'servicios', label: 'Servicios' },
                { value: 'productos', label: 'Productos' }
              ].map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  aria-pressed={tipoGrafico === opcion.value}
                  onClick={() => setTipoGrafico(opcion.value)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition ${tipoGrafico === opcion.value
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-[#292929]'}`}
                >
                  {opcion.label}
                </button>
              ))}
            </div>
          </div>
          {tipoGrafico === 'ganancia' ? (
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              Mostrar
              <select
                value={mesesVisibles}
                onChange={(event) => setMesesVisibles(Number(event.target.value))}
                className="rounded border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-[#141414]"
              >
                <option value={2}>2 meses</option>
                <option value={5}>5 meses</option>
              </select>
            </label>
          ) : (
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              Mes
              <input
                type="month"
                aria-label="Mes del ranking"
                value={mesConceptos}
                onChange={(event) => setMesConceptos(event.target.value)}
                className="rounded border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-[#141414]"
              />
            </label>
          )}
        </div>

        {loading ? (
          <p className="py-14 text-center text-sm text-slate-500">Cargando movimientos...</p>
        ) : errorCarga ? (
          <p role="alert" className="py-14 text-center text-sm text-rose-500">{errorCarga}</p>
        ) : tipoGrafico === 'ganancia' ? (
          <div className="overflow-x-auto">
            <div
              className="grid h-64 items-end gap-3 border-b border-slate-200 px-2 pb-2 pt-5 dark:border-slate-700 md:gap-6"
              style={{ minWidth: `${Math.max(meses.length * 72, 480)}px`, gridTemplateColumns: `repeat(${meses.length}, minmax(0, 1fr))` }}
            >
              {meses.map((mes) => {
                const esActual = mes.key === mesActual;
                const altura = mes.ganancia === 0 ? 2 : Math.max((Math.abs(mes.ganancia) / escala) * 100, 3);
                return (
                  <div key={mes.key} className="group flex h-full min-w-0 flex-col items-center justify-end">
                    <span className="mb-2 whitespace-nowrap text-xs font-semibold">
                      {mes.ganancia < 0 ? '-' : ''}{formatoMoneda(Math.abs(mes.ganancia))}
                    </span>
                    <div
                      title={`${mes.mes} ${mes.anio}: ${formatoMoneda(mes.ganancia)} netos. Ingresos ${formatoMoneda(mes.ingresos)} menos egresos ${formatoMoneda(mes.egresos)}.`}
                      className={`w-full max-w-14 rounded-t transition-all ${
                        esActual ? 'bg-[#D4AF37] ring-2 ring-[#D4AF37]/30' :
                        mes.ganancia < 0 ? 'bg-rose-500' : 'bg-emerald-600'
                      }`}
                      style={{ height: `${altura}%` }}
                    />
                    <span className={`mt-2 text-xs ${esActual ? 'font-bold text-[#9a7610] dark:text-[#D4AF37]' : 'text-slate-500 dark:text-slate-400'}`}>
                      {mes.mes} {mes.anio}
                    </span>
                    {esActual && <span className="mt-1 text-[10px] font-semibold text-[#9a7610] dark:text-[#D4AF37]">Mes actual</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : rankingConceptos.length === 0 ? (
          <p className="py-14 text-center text-sm text-slate-500">
            No hay {tipoGrafico === 'servicios' ? 'servicios realizados' : 'productos vendidos'} en este mes.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="flex h-64 min-w-full items-end gap-5 border-b border-slate-200 px-2 pb-2 pt-5 dark:border-slate-700"
              style={{ minWidth: `${Math.max(rankingConceptos.length * 112, 480)}px` }}
            >
              {rankingConceptos.map((item, index) => (
                <div key={item.nombre} className="flex h-full w-24 shrink-0 flex-col items-center justify-end">
                  <span className="mb-2 text-xs font-semibold">{item.cantidad} uds.</span>
                  <div
                    title={`${item.nombre}: ${item.cantidad} unidades, ${formatoMoneda(item.monto)} en ventas`}
                    className={`w-12 rounded-t transition-all ${index === 0 ? 'bg-[#D4AF37]' : tipoGrafico === 'servicios' ? 'bg-emerald-600' : 'bg-sky-600'}`}
                    style={{ height: `${Math.max((item.cantidad / maxCantidad) * 100, 3)}%` }}
                  />
                  <span className="mt-2 line-clamp-2 h-8 w-full text-center text-xs" title={item.nombre}>{item.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tipoGrafico === 'ganancia' && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            El historial de cierres concilia estos movimientos; no se suma aparte para evitar duplicar ingresos y egresos.
          </p>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar cliente, servicio o producto"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              className="w-full rounded border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#D4AF37] dark:border-slate-800 dark:bg-[#1c1c1c]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <input
              aria-label="Fecha inicial"
              type="date"
              value={fechaInicio}
              onChange={(event) => setFechaInicio(event.target.value)}
              className="rounded border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-[#1c1c1c]"
            />
            <span>hasta</span>
            <input
              aria-label="Fecha final"
              type="date"
              value={fechaFin}
              onChange={(event) => setFechaFin(event.target.value)}
              className="rounded border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-[#1c1c1c]"
            />
          </label>
          <div className="inline-flex rounded border border-slate-300 p-0.5 dark:border-slate-700" role="group" aria-label="Filtrar tabla por tipo de compra">
            {[
              { value: 'todos', label: 'Todo' },
              { value: 'servicios', label: 'Servicios' },
              { value: 'productos', label: 'Productos' }
            ].map((opcion) => (
              <button
                key={opcion.value}
                type="button"
                aria-pressed={tipoTabla === opcion.value}
                onClick={() => setTipoTabla(opcion.value)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition ${tipoTabla === opcion.value
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-[#292929]'}`}
              >
                {opcion.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={limpiarFiltrosTabla}
            className="rounded border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-[#292929]"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className={`w-full text-left text-sm ${tipoTabla === 'todos' ? 'min-w-[950px]' : 'min-w-[650px]'}`}>
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-[#1c1c1c] dark:text-slate-400">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Cliente</th>
                {tipoTabla !== 'productos' && <th className="p-3">Servicio / cantidad</th>}
                {tipoTabla !== 'productos' && <th className="p-3 text-right">Monto servicio</th>}
                {tipoTabla !== 'servicios' && <th className="p-3">Producto / cantidad</th>}
                {tipoTabla !== 'servicios' && <th className="p-3 text-right">Monto producto</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={tipoTabla === 'todos' ? 6 : 4} className="p-8 text-center text-slate-500">Cargando ventas...</td></tr>
              ) : errorCarga ? (
                <tr><td colSpan={tipoTabla === 'todos' ? 6 : 4} className="p-8 text-center text-rose-500">{errorCarga}</td></tr>
              ) : ventasFiltradas.length === 0 ? (
                <tr><td colSpan={tipoTabla === 'todos' ? 6 : 4} className="p-8 text-center text-slate-500">No hay ventas para los filtros seleccionados.</td></tr>
              ) : ventasFiltradas.map((venta) => (
                <tr key={venta.codigo_venta} className="align-top hover:bg-slate-50 dark:hover:bg-[#1a1a1a]">
                  <td className="whitespace-nowrap p-3">{venta.fechaClave ? venta.fechaClave.split('-').reverse().join('/') : '-'}</td>
                  <td className="p-3 font-medium">{venta.nombre_cliente || 'Cliente general'}</td>
                  {tipoTabla !== 'productos' && (
                    <>
                      <td className="p-3">
                        {textoConceptos(venta.servicios)}
                      </td>
                      <td className="whitespace-nowrap p-3 text-right">{formatoMoneda(venta.montoServicios)}</td>
                    </>
                  )}
                  {tipoTabla !== 'servicios' && (
                    <>
                      <td className="p-3">
                        {textoConceptos(venta.productos)}
                      </td>
                      <td className="whitespace-nowrap p-3 text-right">{formatoMoneda(venta.montoProductos)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-right text-xs text-slate-500">{ventasFiltradas.length} ventas</p>
      </section>

      {modalPDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-modal-title"
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#181818]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="pdf-modal-title" className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-rose-700" /> Contenido del PDF
              </h2>
              <button type="button" onClick={() => setModalPDF(false)} aria-label="Cerrar" className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#292929]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Se exportará la vista actual y las filas de la tabla que coinciden con tus filtros.
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded border border-slate-200 p-3 text-sm dark:border-slate-700">
                <input type="checkbox" checked={incluirGraficoPDF} onChange={(event) => setIncluirGraficoPDF(event.target.checked)} />
                <span>Incluir gráfico: {tipoGrafico === 'ganancia' ? 'ganancia neta' : tipoGrafico}</span>
              </label>
              <label className="flex items-center gap-3 rounded border border-slate-200 p-3 text-sm dark:border-slate-700">
                <input type="checkbox" checked={incluirTablaPDF} onChange={(event) => setIncluirTablaPDF(event.target.checked)} />
                <span>Incluir tabla ({filasExportables.length} filas filtradas)</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setModalPDF(false)} className="rounded border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
                Cancelar
              </button>
              <button
                type="button"
                onClick={descargarPDF}
                disabled={exportando || (!incluirGraficoPDF && !incluirTablaPDF)}
                className="inline-flex items-center gap-2 rounded bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> {exportando ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </section>
        </div>
      )}

      {modalExcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="excel-modal-title"
            className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#181818]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 id="excel-modal-title" className="flex items-center gap-2 text-lg font-semibold">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-700" /> Vista previa del Excel
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {filasExportables.length} filas · filtros y columnas actuales
                </p>
              </div>
              <button type="button" onClick={() => setModalExcel(false)} aria-label="Cerrar" className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#292929]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600 dark:bg-[#252525] dark:text-slate-300">
                  <tr>
                    {columnasExportables.map((columna) => <th key={columna.clave} className="whitespace-nowrap p-3">{columna.clave}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filasExportables.length ? filasExportables.map((fila, index) => (
                    <tr key={`${fila.Fecha}-${index}`}>
                      {columnasExportables.map((columna) => (
                        <td key={columna.clave} className={`p-3 ${columna.tipo === 'monto' ? 'whitespace-nowrap text-right' : ''}`}>
                          {columna.tipo === 'monto' ? formatoMoneda(fila[columna.clave]) : fila[columna.clave]}
                        </td>
                      ))}
                    </tr>
                  )) : (
                    <tr><td colSpan={columnasExportables.length} className="p-8 text-center text-slate-500">No hay filas con los filtros actuales.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setModalExcel(false)} className="rounded border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
                Cancelar
              </button>
              <button
                type="button"
                onClick={descargarExcel}
                disabled={filasExportables.length === 0}
                className="inline-flex items-center gap-2 rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Descargar .xlsx
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

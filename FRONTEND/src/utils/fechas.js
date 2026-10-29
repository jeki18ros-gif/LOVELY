/**
 * Utilidades para manejo consistente de fechas en el sistema
 * Zona horaria: Perú (UTC-5)
 */

/**
 * Obtiene la fecha y hora actual en formato ISO con la zona horaria de Perú (-05:00)
 * @returns {string} Fecha en formato ISO string con offset
 */
export const obtenerFechaLocalISO = () => {
  const ahora = new Date();
  const opciones = {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  const partes = new Intl.DateTimeFormat('en-CA', opciones).formatToParts(ahora);
  const get = (tipo) => partes.find(p => p.type === tipo)?.value;

  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}-05:00`;
};

/**
 * Obtiene solo la fecha actual en formato YYYY-MM-DD respetando la zona horaria de Perú
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const obtenerFechaHoyLocal = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
};

/**
 * Obtiene el rango de inicio y fin de un día específico forzando la zona horaria de Perú (-05:00)
 * @param {string} fechaString Fecha en formato YYYY-MM-DD
 * @returns {Object} Objeto con propiedades inicio y fin en formato ISO exacto para Supabase
 */
export const obtenerRangoDelDia = (fechaString) => {
  // Forzamos explícitamente el sufijo -05:00 para evitar que tome UTC o la hora local del navegador
  const inicioLocal = `${fechaString}T00:00:00-05:00`;
  const finLocal = `${fechaString}T23:59:59.999-05:00`;

  return {
    inicio: new Date(inicioLocal).toISOString(),
    fin: new Date(finLocal).toISOString()
  };
};

/**
 * Extrae solo la porción de fecha (YYYY-MM-DD) de un timestamp ISO
 * @param {string} timestamp Timestamp en formato ISO
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const extraerFecha = (timestamp) => {
  if (!timestamp) return '';
  return timestamp.substring(0, 10);
};
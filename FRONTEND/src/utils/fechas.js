/**
 * Utilidades para manejo consistente de fechas en el sistema
 * Zona horaria: Perú (UTC-5)
 */

/**
 * Obtiene la fecha y hora actual en formato ISO con hora local de Perú
 * @returns {string} Fecha en formato ISO (ejemplo: "2023-10-22T23:30:00.000")
 */
export const obtenerFechaLocalISO = () => {
  const hoy = new Date();
  const offset = hoy.getTimezoneOffset() * 60000;
  return new Date(hoy.getTime() - offset).toISOString();
};

/**
 * Obtiene solo la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha en formato YYYY-MM-DD (ejemplo: "2023-10-22")
 */
export const obtenerFechaHoyLocal = () => {
  const hoy = new Date();
  const offset = hoy.getTimezoneOffset() * 60000;
  return new Date(hoy.getTime() - offset).toISOString().split('T')[0];
};

/**
 * Obtiene el rango de inicio y fin de un día específico
 * @param {string} fechaString - Fecha en formato YYYY-MM-DD
 * @returns {Object} Objeto con propiedades inicio y fin
 */
export const obtenerRangoDelDia = (fechaString) => {
  return {
    inicio: `${fechaString}T00:00:00`,
    fin: `${fechaString}T23:59:59.999`
  };
};

/**
 * Extrae solo la porción de fecha (YYYY-MM-DD) de un timestamp ISO
 * @param {string} timestamp - Timestamp en formato ISO
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const extraerFecha = (timestamp) => {
  if (!timestamp) return '';
  return timestamp.substring(0, 10);
};

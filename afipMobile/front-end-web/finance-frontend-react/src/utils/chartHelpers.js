import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';

/**
 * Agrupa datos por fecha y suma los montos
 * @param {Array} data - Array de datos
 * @param {string} dateField - Campo de fecha en los datos
 * @param {string} amountField - Campo de monto en los datos
 * @returns {Array} Array de objetos {date, amount}
 */
export const groupByDate = (data, dateField, amountField) => {
  if (!data || data.length === 0) return [];

  const grouped = {};

  data.forEach(item => {
    try {
      const date = format(parseISO(item[dateField]), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date] += parseFloat(item[amountField]) || 0;
    } catch (error) {
      console.error('Error parsing date:', error);
    }
  });

  return Object.entries(grouped)
    .map(([date, amount]) => ({
      date,
      amount,
      displayDate: format(parseISO(date), 'dd/MM')
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Obtiene datos de los últimos N días
 * @param {Array} data - Array de datos
 * @param {string} dateField - Campo de fecha
 * @param {number} days - Número de días (default: 30)
 * @returns {Array} Datos filtrados
 */
export const getLastNDays = (data, dateField, days = 30) => {
  if (!data || data.length === 0) return [];

  const now = new Date();
  const startDate = subDays(now, days);

  return data.filter(item => {
    try {
      const itemDate = parseISO(item[dateField]);
      return itemDate >= startDate && itemDate <= now;
    } catch (error) {
      return false;
    }
  });
};

/**
 * Genera datos completos para los últimos 30 días (incluyendo días sin datos)
 * @param {Array} data - Array de datos agrupados
 * @param {number} days - Número de días (default: 30)
 * @returns {Array} Array con todos los días
 */
export const fillMissingDays = (data, days = 30) => {
  const now = new Date();
  const startDate = subDays(now, days - 1);

  const allDays = eachDayOfInterval({ start: startDate, end: now });

  const dataMap = new Map(data.map(item => [item.date, item.amount]));

  return allDays.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const displayDate = format(day, 'dd/MM');
    return {
      date: dateStr,
      displayDate,
      amount: dataMap.get(dateStr) || 0
    };
  });
};

/**
 * Procesa datos para gráfica de líneas (últimos 30 días)
 * @param {Array} data - Array de datos
 * @param {string} dateField - Campo de fecha
 * @param {string} amountField - Campo de monto
 * @returns {Array} Datos procesados para la gráfica
 */
export const processChartData = (data, dateField, amountField) => {
  // Filtrar últimos 30 días
  const recentData = getLastNDays(data, dateField, 30);
  
  // Agrupar por fecha
  const grouped = groupByDate(recentData, dateField, amountField);
  
  // Rellenar días faltantes
  const filled = fillMissingDays(grouped, 30);
  
  return filled;
};

/**
 * Calcula el total de un array de datos
 * @param {Array} data - Array de datos
 * @param {string} amountField - Campo de monto
 * @returns {number} Total
 */
export const calculateTotal = (data, amountField) => {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, item) => sum + (parseFloat(item[amountField]) || 0), 0);
};

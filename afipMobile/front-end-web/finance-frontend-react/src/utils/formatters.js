import { format, parseISO } from 'date-fns';

/**
 * Format currency amount in Colombian Pesos
 */
export const formatCurrency = (amount, currency = 'COP') => {
    if (amount === null || amount === undefined) return '$0';

    const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

    return formatted;
};

/**
 * Format date to readable Spanish format
 */
export const formatDate = (date) => {
    if (!date) return '';

    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'dd/MM/yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
    if (!date) return '';

    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'dd/MM/yyyy HH:mm');
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return '';
    }
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';

    return new Intl.NumberFormat('es-CO').format(number);
};

/**
 * Get relative time (e.g., "hace 2 días")
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - parsedDate) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;

    return formatDate(parsedDate);
};

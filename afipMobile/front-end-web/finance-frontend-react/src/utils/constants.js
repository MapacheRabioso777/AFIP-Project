// Account types
export const ACCOUNT_TYPES = [
    { value: 'Ahorros', label: 'Ahorros' },
    { value: 'Corriente', label: 'Corriente' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta de Crédito', label: 'Tarjeta de Crédito' },
];

// Currency options
export const CURRENCIES = [
    { value: 'COP', label: 'COP - Peso Colombiano' },
    { value: 'USD', label: 'USD - Dólar' },
    { value: 'EUR', label: 'EUR - Euro' },
];

// Debt statuses
export const DEBT_STATUSES = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en progreso', label: 'En Progreso' },
    { value: 'pagada', label: 'Pagada' },
];

// Default pagination
export const ITEMS_PER_PAGE = 10;

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

// API endpoints
export const API_ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/user',
    ACCOUNTS: '/cuentas',
    INCOMES: '/ingresos',
    EXPENSES: '/gastos',
    BUDGETS: '/presupuestos',
    GOALS: '/metas',
    DEBTS: '/deudas',
    CATEGORIES: '/categorias',
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
};

// Navigation menu items
export const MENU_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: 'home' },
    { name: 'Cuentas', path: '/cuentas', icon: 'wallet' },
    { name: 'Ingresos', path: '/ingresos', icon: 'trending-up' },
    { name: 'Gastos', path: '/gastos', icon: 'trending-down' },
    { name: 'Presupuestos', path: '/presupuestos', icon: 'target' },
    { name: 'Metas', path: '/metas', icon: 'flag' },
    { name: 'Deudas', path: '/deudas', icon: 'credit-card' },
    { name: 'Categorías', path: '/categorias', icon: 'tag' },
];

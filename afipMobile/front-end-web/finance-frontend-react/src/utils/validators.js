import * as Yup from 'yup';

// Login validation schema
export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('El correo no es válido')
        .required('El correo es requerido'),
    password: Yup.string()
        .min(4, 'La contraseña debe tener al menos 4 caracteres')
        .required('La contraseña es requerida'),
});

// Registration validation schema
export const registerSchema = Yup.object().shape({
    email: Yup.string()
        .email('El correo no es válido')
        .required('El correo es requerido'),
    username: Yup.string()
        .required('El usuario es requerido'),
    password: Yup.string()
        .min(4, 'La contraseña debe tener al menos 4 caracteres')
        .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
});

// Account validation schema
export const accountSchema = Yup.object().shape({
    account_name: Yup.string()
        .required('El nombre de la cuenta es requerido')
        .max(100, 'Máximo 100 caracteres'),
    account_type: Yup.string()
        .required('El tipo de cuenta es requerido'),
    account_balance: Yup.number()
        .required('El saldo es requerido')
        .min(0, 'El saldo no puede ser negativo'),
    account_currency: Yup.string()
        .default('COP'),
});

// Income validation schema
export const incomeSchema = Yup.object().shape({
    income_name: Yup.string()
        .required('El nombre del ingreso es requerido')
        .max(100, 'Máximo 100 caracteres'),
    income_amount: Yup.number()
        .required('El monto es requerido')
        .positive('El monto debe ser positivo'),
    income_description: Yup.string()
        .max(500, 'Máximo 500 caracteres'),
    income_date: Yup.date()
        .required('La fecha es requerida'),
    account_FK: Yup.number()
        .nullable()
        .notRequired(),
    category_id: Yup.number()
        .required('Selecciona una categoría'),
});

// Expense validation schema
export const expenseSchema = Yup.object().shape({
    expense_name: Yup.string()
        .required('El nombre del gasto es requerido')
        .max(100, 'Máximo 100 caracteres'),
    expense_amount: Yup.number()
        .required('El monto es requerido')
        .positive('El monto debe ser positivo'),
    expense_description: Yup.string()
        .max(500, 'Máximo 500 caracteres'),
    expense_date: Yup.date()
        .required('La fecha es requerida'),
    category_FK: Yup.number()
        .required('Selecciona una categoría'),
    account_FK: Yup.number()
        .nullable()
        .notRequired(),
    budget_FK: Yup.number()
        .nullable() // Permite null
        .notRequired(), // No es requerido
});

// Budget validation schema
export const budgetSchema = Yup.object().shape({
    budget_name: Yup.string()
        .required('El nombre del presupuesto es requerido')
        .max(100, 'Máximo 100 caracteres'),
    budget_amount: Yup.number()
        .required('El monto es requerido')
        .positive('El monto debe ser positivo'),
    budget_currency: Yup.string()
        .default('COP'),
});

// Goal validation schema
export const goalSchema = Yup.object().shape({
    goal_name: Yup.string()
        .required('El nombre de la meta es requerido')
        .max(100, 'Máximo 100 caracteres'),
    goal_amount: Yup.number()
        .required('El monto objetivo es requerido')
        .positive('El monto debe ser positivo'),
    goal_target_date: Yup.date()
        .required('La fecha objetivo es requerida')
        .min(new Date(), 'La fecha debe ser futura'),
    goal_description: Yup.string()
        .max(500, 'Máximo 500 caracteres'),
});

// Debt validation schema
export const debtSchema = Yup.object().shape({
    debt_name: Yup.string()
        .required('El nombre de la deuda es requerido')
        .max(100, 'Máximo 100 caracteres'),
    debt_amount: Yup.number()
        .required('El monto es requerido')
        .positive('El monto debe ser positivo'),
    debt_currency: Yup.string()
        .default('COP'),
    debt_status: Yup.string()
        .oneOf(['pendiente', 'pagada', 'en progreso'], 'Estado inválido')
        .default('pendiente'),
    debt_description: Yup.string()
        .max(500, 'Máximo 500 caracteres'),
});

// Category validation schema
export const categorySchema = Yup.object().shape({
    category_name: Yup.string()
        .required('El nombre de la categoría es requerido')
        .max(100, 'Máximo 100 caracteres'),
    category_description: Yup.string()
        .max(500, 'Máximo 500 caracteres'),
});

// Categorías predefinidas del sistema
// Estas categorías se crearán automáticamente para cada nuevo usuario

export const PREDEFINED_CATEGORIES = {
    expense: [
        {
            category_name: 'Salud',
            category_description: 'Gastos médicos, medicamentos y cuidado de la salud',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Ocio',
            category_description: 'Entretenimiento, hobbies y actividades recreativas',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Casa',
            category_description: 'Alquiler, hipoteca, servicios y mantenimiento del hogar',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Comida',
            category_description: 'Restaurantes, comida rápida y delivery',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Educación',
            category_description: 'Cursos, libros, materiales educativos',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Regalos',
            category_description: 'Obsequios y regalos para otras personas',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Alimentación',
            category_description: 'Supermercado y compras de alimentos',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Familia',
            category_description: 'Gastos familiares y cuidado de dependientes',
            category_type: 'expense',
            category_is_predefined: true,
        },
        {
            category_name: 'Transporte',
            category_description: 'Combustible, transporte público, mantenimiento vehicular',
            category_type: 'expense',
            category_is_predefined: true,
        },
    ],
    income: [
        {
            category_name: 'Salario',
            category_description: 'Ingresos por trabajo dependiente',
            category_type: 'income',
            category_is_predefined: true,
        },
        {
            category_name: 'Regalo',
            category_description: 'Dinero recibido como regalo',
            category_type: 'income',
            category_is_predefined: true,
        },
        {
            category_name: 'Trabajos',
            category_description: 'Ingresos por trabajos independientes o freelance',
            category_type: 'income',
            category_is_predefined: true,
        },
        {
            category_name: 'Inversiones',
            category_description: 'Rendimientos de inversiones y dividendos',
            category_type: 'income',
            category_is_predefined: true,
        },
        {
            category_name: 'Ahorros',
            category_description: 'Intereses de cuentas de ahorro',
            category_type: 'income',
            category_is_predefined: true,
        },
        {
            category_name: 'Otros',
            category_description: 'Otros ingresos no categorizados',
            category_type: 'income',
            category_is_predefined: true,
        },
    ],
};

// Función helper para obtener todas las categorías predefinidas
export const getAllPredefinedCategories = () => {
    return [...PREDEFINED_CATEGORIES.expense, ...PREDEFINED_CATEGORIES.income];
};

// Función helper para obtener categorías por tipo
export const getPredefinedCategoriesByType = (type) => {
    return PREDEFINED_CATEGORIES[type] || [];
};

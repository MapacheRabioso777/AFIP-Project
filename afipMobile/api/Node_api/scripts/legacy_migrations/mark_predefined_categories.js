import sequelize from './src/config/connect.db.js';
import categoryModel from './src/models/category.model.js';
import { PREDEFINED_CATEGORIES } from './src/config/predefinedCategories.js';

/**
 * Script para marcar las categorías predefinidas existentes
 * Busca categorías por nombre y tipo, y las marca como predefinidas
 */

async function markPredefinedCategories() {
    try {
        console.log('[*] Marcando categorías predefinidas...\n');

        // Obtener nombres de categorías predefinidas
        const predefinedNames = {
            income: PREDEFINED_CATEGORIES.income.map(cat => cat.category_name),
            expense: PREDEFINED_CATEGORIES.expense.map(cat => cat.category_name)
        };

        let totalUpdated = 0;

        // Actualizar categorías de ingreso
        for (const categoryName of predefinedNames.income) {
            const [updated] = await categoryModel.update(
                { category_is_predefined: true },
                {
                    where: {
                        category_name: categoryName,
                        category_type: 'income',
                        category_is_predefined: false // Solo actualizar las que aún no están marcadas
                    }
                }
            );
            if (updated > 0) {
                console.log(`[OK] Marcada: ${categoryName} (income)`);
                totalUpdated += updated;
            }
        }

        // Actualizar categorías de gasto
        for (const categoryName of predefinedNames.expense) {
            const [updated] = await categoryModel.update(
                { category_is_predefined: true },
                {
                    where: {
                        category_name: categoryName,
                        category_type: 'expense',
                        category_is_predefined: false
                    }
                }
            );
            if (updated > 0) {
                console.log(`[OK] Marcada: ${categoryName} (expense)`);
                totalUpdated += updated;
            }
        }

        console.log(`\n[OK] Total de categorías actualizadas: ${totalUpdated}`);
        console.log('\nℹ️  Ahora las categorías predefinidas:');
        console.log('   - Tienen el badge "Sistema" en el frontend');
        console.log('   - No se pueden editar ni eliminar');
        console.log('   - Están protegidas por el sistema');
        
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Error al marcar categorías:', error);
        process.exit(1);
    }
}

// Ejecutar script
markPredefinedCategories();

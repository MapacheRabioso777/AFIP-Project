import sequelize from './src/config/connect.db.js';
import categoryModel from './src/models/category.model.js';

/**
 * Script de migración simplificado para limpiar campos innecesarios
 * y mantener solo category_type
 */

async function cleanupCategoryFields() {
    try {
        console.log('[*] Starting cleanup migration...');

        // Sincronizar el modelo con la base de datos
        // Esto eliminará las columnas category_icon e is_predefined si existen
        await categoryModel.sync({ alter: true });
        console.log('[OK] Table structure cleaned up');

        console.log('[OK] Migration completed successfully!');
        console.log('\nℹ️  Changes applied:');
        console.log('   - Removed category_icon field (if existed)');
        console.log('   - Removed is_predefined field (if existed)');
        console.log('   - Kept category_type field for filtering');
        console.log('\nℹ️  Next steps:');
        console.log('   1. Restart your backend server');
        console.log('   2. New users will get predefined categories automatically');
        console.log('   3. Expense forms will show only expense categories');
        console.log('   4. Income forms will show only income categories');
        
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Migration failed:', error);
        process.exit(1);
    }
}

// Ejecutar migración
cleanupCategoryFields();

import sequelize from './src/config/connect.db.js';
import categoryModel from './src/models/category.model.js';

/**
 * Script para sincronizar el modelo de categorías con la base de datos
 * Agrega el campo category_is_predefined
 */

async function syncCategoryModel() {
    try {
        console.log('[*] Sincronizando modelo de categorías...');

        // Sincronizar el modelo con la base de datos
        // Esto agregará la columna category_is_predefined si no existe
        await categoryModel.sync({ alter: true });
        
        console.log('[OK] Tabla sincronizada correctamente');
        console.log('\nℹ️  Campo agregado:');
        console.log('   - category_is_predefined (BOOLEAN, default: false)');
        console.log('\n✅ Ahora puedes:');
        console.log('   1. Reiniciar el servidor backend');
        console.log('   2. Las categorías deberían aparecer normalmente');
        console.log('   3. Las nuevas categorías predefinidas tendrán is_predefined = true');
        
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Error al sincronizar:', error);
        process.exit(1);
    }
}

// Ejecutar sincronización
syncCategoryModel();

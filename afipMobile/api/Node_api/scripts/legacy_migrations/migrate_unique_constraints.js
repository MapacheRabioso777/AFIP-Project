import sequelize from "./src/config/connect.db.js";

/**
 * Script de migración para eliminar restricciones únicas antiguas
 * y crear índices compuestos únicos por usuario
 */

const migrateUniqueConstraints = async () => {
  try {
    console.log('[*] Iniciando migración de restricciones únicas...\n');

    const queryInterface = sequelize.getQueryInterface();

    // Lista de tablas y campos con restricciones únicas a eliminar
    const tables = [
      { table: 'budgets', field: 'budget_name' },
      { table: 'expenses', field: 'expense_name' },
      { table: 'incomes', field: 'income_name' },
      { table: 'goals', field: 'goal_name' },
      { table: 'debts', field: 'debt_name' },
      { table: 'categories', field: 'category_name' }
    ];

    for (const { table, field } of tables) {
      try {
        console.log(`[*] Procesando tabla: ${table}`);
        
        // Intentar eliminar el índice único antiguo
        // El nombre del índice suele ser el nombre del campo
        try {
          await queryInterface.removeIndex(table, field);
          console.log(`  [OK] Índice único eliminado: ${field}`);
        } catch (error) {
          // Si el índice no existe o ya fue eliminado, continuar
          if (error.message.includes('check that column/key exists')) {
            console.log(`  ℹ️  Índice ${field} no encontrado (ya eliminado o no existe)`);
          } else {
            console.log(`  [!]  Error al eliminar índice ${field}:`, error.message);
          }
        }

        // Intentar eliminar constraint con nombre alternativo
        const constraintName = `${table}_${field}_unique`;
        try {
          await sequelize.query(`ALTER TABLE ${table} DROP INDEX \`${constraintName}\``);
          console.log(`  [OK] Constraint eliminado: ${constraintName}`);
        } catch (error) {
          // Ignorar si no existe
          if (!error.message.includes('check that column/key exists')) {
            console.log(`  ℹ️  Constraint ${constraintName} no encontrado`);
          }
        }

      } catch (error) {
        console.error(`  [ERROR] Error procesando ${table}:`, error.message);
      }
    }

    console.log('\n[*] Sincronizando modelos para crear nuevos índices compuestos...');
    
    // Sincronizar con alter: true para crear los nuevos índices compuestos
    await sequelize.sync({ alter: true });
    
    console.log('\n[OK] Migración completada exitosamente');
    console.log('\n[INFO] Resumen:');
    console.log('   - Restricciones únicas globales eliminadas');
    console.log('   - Índices compuestos por usuario creados');
    console.log('\n[TIP] Ahora cada usuario puede usar los mismos nombres para sus recursos');
    
    process.exit(0);
  } catch (error) {
    console.error('\n[ERROR] Error en la migración:', error);
    process.exit(1);
  }
};

// Ejecutar la migración
migrateUniqueConstraints();

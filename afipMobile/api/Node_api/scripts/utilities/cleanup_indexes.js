import sequelize from "./src/config/connect.db.js";

/**
 * Script para eliminar TODOS los índices únicos problemáticos
 */

const cleanupIndexes = async () => {
  try {
    console.log('[*] Limpiando índices únicos problemáticos...\n');

    const tables = [
      { table: 'budgets', field: 'budget_name' },
      { table: 'expenses', field: 'expense_name' },
      { table: 'incomes', field: 'income_name' },
      { table: 'goals', field: 'goal_name' },
      { table: 'debts', field: 'debt_name' },
      { table: 'categories', field: 'category_name' }
    ];

    for (const { table, field } of tables) {
      console.log(`\n[*] Procesando tabla: ${table}`);
      console.log('─'.repeat(50));
      
      // Obtener todos los índices de la tabla
      const [indexes] = await sequelize.query(`SHOW INDEX FROM ${table}`);
      
      // Encontrar todos los índices únicos relacionados con el campo (excepto PRIMARY)
      const uniqueIndexes = indexes.filter(idx => 
        idx.Non_unique === 0 && 
        idx.Key_name !== 'PRIMARY' &&
        idx.Column_name === field
      );

      // Eliminar cada índice único encontrado
      for (const idx of uniqueIndexes) {
        try {
          console.log(`  [-] Eliminando índice: ${idx.Key_name}`);
          await sequelize.query(`ALTER TABLE ${table} DROP INDEX \`${idx.Key_name}\``);
          console.log(`  [OK] Índice eliminado: ${idx.Key_name}`);
        } catch (error) {
          console.log(`  [!] Error eliminando ${idx.Key_name}:`, error.message);
        }
      }

      if (uniqueIndexes.length === 0) {
        console.log(`  ℹ️  No hay índices únicos problemáticos en ${field}`);
      }
    }

    console.log('\n\n[*] Verificando índices restantes...\n');
    
    for (const { table } of tables) {
      const [indexes] = await sequelize.query(`SHOW INDEX FROM ${table}`);
      const uniqueIndexes = indexes.filter(idx => idx.Non_unique === 0 && idx.Key_name !== 'PRIMARY');
      
      console.log(`[INFO] ${table}:`);
      uniqueIndexes.forEach(idx => {
        console.log(`   - ${idx.Key_name}: ${idx.Column_name}`);
      });
    }

    console.log('\n[OK] Limpieza completada');
    console.log('\n[TIP] Ahora reinicia el servidor para que funcione correctamente');
    
    process.exit(0);
  } catch (error) {
    console.error('\n[ERROR] Error:', error);
    process.exit(1);
  }
};

cleanupIndexes();

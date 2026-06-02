import sequelize from "./src/config/connect.db.js";

/**
 * Script para verificar el estado de los índices en la base de datos
 */

const checkIndexes = async () => {
  try {
    console.log('[*] Verificando índices en la base de datos...\n');

    const tables = ['budgets', 'expenses', 'incomes', 'goals', 'debts', 'categories'];

    for (const table of tables) {
      console.log(`\n[INFO] Tabla: ${table}`);
      console.log('─'.repeat(50));
      
      // Obtener todos los índices de la tabla
      const [indexes] = await sequelize.query(`SHOW INDEX FROM ${table}`);
      
      // Filtrar solo índices únicos
      const uniqueIndexes = indexes.filter(idx => idx.Non_unique === 0);
      
      if (uniqueIndexes.length === 0) {
        console.log('  ℹ️  No hay índices únicos');
      } else {
        uniqueIndexes.forEach(idx => {
          console.log(`  [+] ${idx.Key_name}: ${idx.Column_name} (Unique: ${idx.Non_unique === 0 ? 'Sí' : 'No'})`);
        });
      }
    }

    console.log('\n\n[*] Verificando datos existentes...\n');
    
    // Verificar si hay datos que puedan estar causando conflictos
    for (const table of tables) {
      const [rows] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`[INFO] ${table}: ${rows[0].count} registros`);
    }

    console.log('\n[OK] Verificación completada');
    process.exit(0);
  } catch (error) {
    console.error('\n[ERROR] Error:', error);
    process.exit(1);
  }
};

checkIndexes();

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config({ path: ".env" });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

async function runMigration() {
    try {
        console.log('Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('[OK] Conexión exitosa');

        console.log('Ejecutando migración: hacer budget_FK nullable...');
        
        // Paso 0: Buscar el nombre de la restricción de clave foránea
        console.log('0. Buscando restricción de clave foránea...');
        const [constraints] = await sequelize.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
            AND TABLE_NAME = 'expenses' 
            AND COLUMN_NAME = 'budget_FK'
            AND REFERENCED_TABLE_NAME IS NOT NULL;
        `);
        
        if (constraints.length > 0) {
            const fkName = constraints[0].CONSTRAINT_NAME;
            console.log(`  → Encontrada: ${fkName}`);
            
            // Paso 1: Eliminar la restricción de clave foránea
            console.log('1. Eliminando restricción de clave foránea...');
            await sequelize.query(`ALTER TABLE expenses DROP FOREIGN KEY ${fkName};`);
        } else {
            console.log('  → No se encontró clave foránea (puede que ya se eliminó)');
        }
        
        // Paso 2: Modificar la columna para permitir NULL
        console.log('2. Modificando columna budget_FK...');
        await sequelize.query(`
            ALTER TABLE expenses 
            MODIFY COLUMN budget_FK INT UNSIGNED NULL;
        `);
        
        console.log('[OK] Migración completada exitosamente');
        console.log('  ℹ️ Reinicia el servidor backend para que Sequelize recree la clave foránea');

        // Verificar el cambio
        const [results] = await sequelize.query(`DESCRIBE expenses`);
        const budgetFKColumn = results.find(col => col.Field === 'budget_FK');
        console.log('\nEstado de budget_FK:', budgetFKColumn);

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('[ERROR] Error ejecutando migración:', error.message);
        await sequelize.close();
        process.exit(1);
    }
}

runMigration();

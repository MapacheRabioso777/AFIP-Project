import sequelize from "./src/config/connect.db.js";

/**
 * Script de migración para agregar campos de montos actuales a las tablas
 * Este script agrega:
 * - goal_current_amount a la tabla goals
 * - debt_paid_amount a la tabla debts
 * - budget_spent_amount a la tabla budgets
 * - category_allocated_amount a la tabla categories
 */

async function addCurrentAmountFields() {
    try {
        console.log('[*] Iniciando migración de base de datos...\n');

        // Agregar goal_current_amount a goals
        try {
            await sequelize.query(`
                ALTER TABLE goals 
                ADD COLUMN goal_current_amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL
            `);
            console.log('[OK] Campo goal_current_amount agregado a la tabla goals');
        } catch (error) {
            if (error.message.includes('Duplicate column name')) {
                console.log('[!] Campo goal_current_amount ya existe en goals');
            } else {
                throw error;
            }
        }

        // Agregar debt_paid_amount a debts
        try {
            await sequelize.query(`
                ALTER TABLE debts 
                ADD COLUMN debt_paid_amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL
            `);
            console.log('[OK] Campo debt_paid_amount agregado a la tabla debts');
        } catch (error) {
            if (error.message.includes('Duplicate column name')) {
                console.log('[!] Campo debt_paid_amount ya existe en debts');
            } else {
                throw error;
            }
        }

        // Agregar budget_spent_amount a budgets
        try {
            await sequelize.query(`
                ALTER TABLE budgets 
                ADD COLUMN budget_spent_amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL
            `);
            console.log('[OK] Campo budget_spent_amount agregado a la tabla budgets');
        } catch (error) {
            if (error.message.includes('Duplicate column name')) {
                console.log('[!] Campo budget_spent_amount ya existe en budgets');
            } else {
                throw error;
            }
        }

        // Agregar category_allocated_amount a categories
        try {
            await sequelize.query(`
                ALTER TABLE categories 
                ADD COLUMN category_allocated_amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL
            `);
            console.log('[OK] Campo category_allocated_amount agregado a la tabla categories');
        } catch (error) {
            if (error.message.includes('Duplicate column name')) {
                console.log('[!] Campo category_allocated_amount ya existe en categories');
            } else {
                throw error;
            }
        }

        console.log('\n[OK] Migración completada exitosamente!');
        console.log('\n[INFO] Resumen:');
        console.log('   - goals.goal_current_amount');
        console.log('   - debts.debt_paid_amount');
        console.log('   - budgets.budget_spent_amount');
        console.log('   - categories.category_allocated_amount');
        
    } catch (error) {
        console.error('\n[ERROR] Error durante la migración:', error.message);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Ejecutar migración
addCurrentAmountFields()
    .then(() => {
        console.log('\n[DONE] Proceso finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n[FATAL] Error fatal:', error);
        process.exit(1);
    });

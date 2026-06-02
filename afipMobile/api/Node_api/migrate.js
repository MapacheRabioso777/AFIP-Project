import sequelize from './src/config/connect.db.js';
import './src/models/user.model.js';
import './src/models/account.model.js';
import './src/models/category.model.js';
import './src/models/budget.model.js';
import './src/models/income.model.js';
import './src/models/expense.model.js';
import './src/models/debt.model.js';
import './src/models/goal.model.js';
import './src/models/debtPayment.model.js';
import './src/models/incomeAssignment.model.js';

async function migrate() {
    try {
        console.log("Iniciando migración (ALTER)...");
        // { alter: true } makes Sequelize alter the existing tables to match the models
        await sequelize.sync({ alter: true });
        console.log("Migración completada exitosamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error durante la migración:", error);
        process.exit(1);
    }
}

migrate();

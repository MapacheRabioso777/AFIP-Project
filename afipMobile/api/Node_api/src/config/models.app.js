import sequelize from "../config/connect.db.js";
import User from "../models/user.model.js";
import Account from "../models/account.model.js";
import Category from "../models/category.model.js";
import Expense from "../models/expense.model.js";
import Income from "../models/income.model.js";
import IncomeAssignment from "../models/incomeAssignment.model.js";
import Goal from "../models/goal.model.js";
import Debt from "../models/debt.model.js";
import DebtPayment from "../models/debtPayment.model.js";
import Budget from "../models/budget.model.js";

// ========== USER Y ACCOUNT ==========
User.hasMany(Account, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'accounts',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Account.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== USER Y CATEGORY ==========
User.hasMany(Category, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'categories',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Category.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== USER Y EXPENSE ==========
User.hasMany(Expense, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'expenses',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Expense.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== CATEGORY Y EXPENSE ==========
Category.hasMany(Expense, {
  foreignKey: 'category_FK',
  sourceKey: 'category_id',
  as: 'expenses',
  onDelete: 'RESTRICT', // No permite eliminar categoría si tiene gastos
  onUpdate: 'CASCADE'
});

Expense.belongsTo(Category, {
  foreignKey: 'category_FK',
  targetKey: 'category_id',
  as: 'category'
});

// ========== ACCOUNT Y EXPENSE ==========
Account.hasMany(Expense, {
  foreignKey: 'account_FK',
  sourceKey: 'account_id',
  as: 'expenses',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Expense.belongsTo(Account, {
  foreignKey: 'account_FK',
  targetKey: 'account_id',
  as: 'account'
});

// ========== USER Y INCOME ==========
User.hasMany(Income, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'incomes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Income.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== ACCOUNT Y INCOME ==========
Account.hasMany(Income, {
  foreignKey: 'account_FK',
  sourceKey: 'account_id',
  as: 'incomes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Income.belongsTo(Account, {
  foreignKey: 'account_FK',
  targetKey: 'account_id',
  as: 'account'
});

// ========== CATEGORY Y INCOME ==========
Category.hasMany(Income, {
  foreignKey: 'category_FK',
  sourceKey: 'category_id',
  as: 'incomes',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Income.belongsTo(Category, {
  foreignKey: 'category_FK',
  targetKey: 'category_id',
  as: 'category'
});


// ========== INCOME Y INCOME_ASSIGNMENT ==========
Income.hasMany(IncomeAssignment, {
  foreignKey: 'income_FK',
  sourceKey: 'income_id',
  as: 'assignments',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

IncomeAssignment.belongsTo(Income, {
  foreignKey: 'income_FK',
  targetKey: 'income_id',
  as: 'income'
});

// ========== USER Y GOAL ==========
User.hasMany(Goal, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'goals',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Goal.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== BUDGET Y USER ==========
User.hasMany(Budget, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'budgets',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Budget.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== DEBT Y USER ==========
User.hasMany(Debt, {
  foreignKey: 'user_FK',
  sourceKey: 'user_id',
  as: 'debts',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Debt.belongsTo(User, {
  foreignKey: 'user_FK',
  targetKey: 'user_id',
  as: 'user'
});

// ========== DEBT Y DEBT_PAYMENT ==========
Debt.hasMany(DebtPayment, {
  foreignKey: 'debt_FK',
  sourceKey: 'debt_id',
  as: 'payments',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

DebtPayment.belongsTo(Debt, {
  foreignKey: 'debt_FK',
  targetKey: 'debt_id',
  as: 'debt'
});

// ============================================
// EXPORTAR MODELOS Y SEQUELIZE
// ============================================

const modelsApp = async (sync = false) => {
  if (sync) {
    try {
      // alter: true actualiza las tablas sin borrar datos
      // force: true borra y recrea las tablas (¡CUIDADO! Borra todos los datos)
      await sequelize.sync({ alter: true });
      console.log('✅ Tablas sincronizadas correctamente con la base de datos');
    } catch (error) {
      console.error('❌ Error al sincronizar las tablas:', error);
    }
  }
  
  return {
    sequelize,
    User,
    Account,
    Category,
    Expense,
    Income,
    IncomeAssignment,
    Goal,
    Debt,
    DebtPayment,
    Budget
  };
};

export default modelsApp;

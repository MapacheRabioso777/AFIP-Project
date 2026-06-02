
import expenseModel from "../models/expense.model.js";
import accountModel from "../models/account.model.js";
import budgetModel from "../models/budget.model.js";
import categoryModel from "../models/category.model.js";
import sequelize from "../config/connect.db.js";

// Create Expense (POST)
export const createExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        await expenseModel.sync();
        const dataExpense = req.body;

        // Si no se envía expense_date, usar la fecha actual
        if (!dataExpense.expense_date) {
            dataExpense.expense_date = new Date();
        }

        // Validar cuenta solo si se proporcionó account_FK
        if (dataExpense.account_FK) {
            const account = await accountModel.findOne({
                where: { 
                    account_id: dataExpense.account_FK, 
                    user_FK: req.user.user_id 
                },
                transaction
            });

            if (!account) {
                await transaction.rollback();
                return res.status(404).json({
                    ok: false,
                    status: 404,
                    message: "Account not found or you don't have permission to access it"
                });
            }

            // Validar que la cuenta tenga saldo suficiente
            if (parseFloat(account.account_balance) < parseFloat(dataExpense.expense_amount)) {
                await transaction.rollback();
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    message: `Saldo insuficiente. Balance actual: $${account.account_balance}, Gasto: $${dataExpense.expense_amount}`
                });
            }

            // Restar el gasto del saldo de la cuenta
            await account.decrement('account_balance', { 
                by: parseFloat(dataExpense.expense_amount), 
                transaction 
            });
        }

        // Si hay una categoría asociada, incrementar su total
        if (dataExpense.category_FK) {
            const category = await categoryModel.findOne({
                where: { 
                    category_id: dataExpense.category_FK,
                    user_FK: req.user.user_id
                },
                transaction
            });
            
            if (category) {
                // Incrementar el total de la categoría
                await category.increment('category_allocated_amount', { 
                    by: parseFloat(dataExpense.expense_amount), 
                    transaction 
                });
            }
        }

        // Si hay un presupuesto asociado, incrementar el monto gastado
        if (dataExpense.budget_FK) {
            const budget = await budgetModel.findOne({
                where: { 
                    budget_id: dataExpense.budget_FK,
                    user_FK: req.user.user_id
                },
                transaction
            });
            
            if (budget) {
                await budget.increment('budget_spent_amount', { 
                    by: parseFloat(dataExpense.expense_amount), 
                    transaction 
                });
            }
        }

        // Crear el gasto
        const createExpense = await expenseModel.create({
            expense_name: dataExpense.expense_name,
            expense_amount: dataExpense.expense_amount,
            expense_date: dataExpense.expense_date,
            expense_description: dataExpense.expense_description,
            user_FK: req.user.user_id,
            category_FK: dataExpense.category_FK,
            account_FK: dataExpense.account_FK || null,
            budget_FK: dataExpense.budget_FK || null,
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Expense created successfully",
            expense: createExpense
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error creating expense",
            error: error.message
        });
    }
};

// Get All Expenses (GET) - Solo del usuario autenticado
export const getExpenses = async (req, res) => {
    try {
        await expenseModel.sync();

        // Filtrar solo los gastos del usuario autenticado
        const expenses = await expenseModel.findAll({
            where: { user_FK: req.user.user_id }
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: expenses
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching expenses",
            error: error.message
        });
    }
};

// Get Expense by ID (GET) - Solo si pertenece al usuario
export const getExpenseById = async (req, res) => {
    try {
        await expenseModel.sync();
        const { id } = req.params;

        // Buscar el gasto Y verificar que pertenece al usuario
        const expense = await expenseModel.findOne({
            where: {
                expense_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!expense) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Expense not found or you don't have permission to access it"
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            body: expense
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching expense",
            error: error.message
        });
    }
};

// Update Expense (PUT) - Solo si pertenece al usuario
export const updateExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        await expenseModel.sync();
        const { id } = req.params;
        const dataExpense = req.body;

        // Buscar el gasto Y verificar que pertenece al usuario
        const expense = await expenseModel.findOne({
            where: {
                expense_id: id,
                user_FK: req.user.user_id
            },
            transaction
        });

        if (!expense) {
            await transaction.rollback();
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Expense not found or you don't have permission to modify it"
            });
        }

        const oldAmount = parseFloat(expense.expense_amount);
        const newAmount = parseFloat(dataExpense.expense_amount);
        const oldCategoryId = expense.category_FK;
        const newCategoryId = dataExpense.category_FK;
        const oldBudgetId = expense.budget_FK;
        const newBudgetId = dataExpense.budget_FK || null;

        // Manejar cambios de categoría
        if (oldCategoryId !== newCategoryId) {
            // Restar del total de la categoría anterior
            if (oldCategoryId) {
                const oldCategory = await categoryModel.findOne({
                    where: { category_id: oldCategoryId, user_FK: req.user.user_id },
                    transaction
                });
                if (oldCategory) {
                    await oldCategory.decrement('category_allocated_amount', {
                        by: oldAmount,
                        transaction
                    });
                }
            }

            // Sumar al total de la nueva categoría
            if (newCategoryId) {
                const newCategory = await categoryModel.findOne({
                    where: { category_id: newCategoryId, user_FK: req.user.user_id },
                    transaction
                });
                if (newCategory) {
                    await newCategory.increment('category_allocated_amount', {
                        by: newAmount,
                        transaction
                    });
                }
            }
        } else if (oldAmount !== newAmount && newCategoryId) {
            // Si solo cambió el monto, ajustar la diferencia en la misma categoría
            const category = await categoryModel.findOne({
                where: { category_id: newCategoryId, user_FK: req.user.user_id },
                transaction
            });
            if (category) {
                const difference = newAmount - oldAmount;
                if (difference > 0) {
                    await category.increment('category_allocated_amount', {
                        by: difference,
                        transaction
                    });
                } else {
                    await category.decrement('category_allocated_amount', {
                        by: Math.abs(difference),
                        transaction
                    });
                }
            }
        }

        // Manejar cambios de presupuesto
        if (oldBudgetId !== newBudgetId) {
            // Restar del gasto del presupuesto anterior
            if (oldBudgetId) {
                const oldBudget = await budgetModel.findOne({
                    where: { budget_id: oldBudgetId, user_FK: req.user.user_id },
                    transaction
                });
                if (oldBudget) {
                    await oldBudget.decrement('budget_spent_amount', {
                        by: oldAmount,
                        transaction
                    });
                }
            }

            // Sumar al gasto del nuevo presupuesto
            if (newBudgetId) {
                const newBudget = await budgetModel.findOne({
                    where: { budget_id: newBudgetId, user_FK: req.user.user_id },
                    transaction
                });
                if (newBudget) {
                    await newBudget.increment('budget_spent_amount', {
                        by: newAmount,
                        transaction
                    });
                }
            }
        } else if (oldAmount !== newAmount && newBudgetId) {
            // Si solo cambió el monto, ajustar la diferencia en el mismo presupuesto
            const budget = await budgetModel.findOne({
                where: { budget_id: newBudgetId, user_FK: req.user.user_id },
                transaction
            });
            if (budget) {
                const difference = newAmount - oldAmount;
                if (difference > 0) {
                    await budget.increment('budget_spent_amount', {
                        by: difference,
                        transaction
                    });
                } else {
                    await budget.decrement('budget_spent_amount', {
                        by: Math.abs(difference),
                        transaction
                    });
                }
            }
        }

        // Ajustar el saldo de la cuenta (solo si existe)
        if (expense.account_FK) {
            const account = await accountModel.findOne({
                where: { account_id: expense.account_FK, user_FK: req.user.user_id },
                transaction
            });

            if (account) {
                const amountDifference = newAmount - oldAmount;
                if (amountDifference !== 0) {
                    if (amountDifference > 0) {
                        // Más gasto, restar del saldo
                        await account.decrement('account_balance', {
                            by: amountDifference,
                            transaction
                        });
                    } else {
                        // Menos gasto, sumar al saldo
                        await account.increment('account_balance', {
                            by: Math.abs(amountDifference),
                            transaction
                        });
                    }
                }
            }
        }

        // Actualizar el gasto
        await expense.update({
            expense_name: dataExpense.expense_name,
            expense_amount: dataExpense.expense_amount,
            expense_date: dataExpense.expense_date,
            expense_description: dataExpense.expense_description,
            category_FK: dataExpense.category_FK,
            budget_FK: newBudgetId,
        }, { transaction });

        await transaction.commit();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Expense updated successfully",
            expense
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating expense",
            error: error.message
        });
    }
};

// Delete Expense (DELETE) - Solo si pertenece al usuario
export const deleteExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        await expenseModel.sync();
        const { id } = req.params;

        // Buscar el gasto Y verificar que pertenece al usuario
        const expense = await expenseModel.findOne({
            where: {
                expense_id: id,
                user_FK: req.user.user_id
            },
            transaction
        });

        if (!expense) {
            await transaction.rollback();
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Expense not found or you don't have permission to delete it"
            });
        }

        // Restar del total de la categoría
        if (expense.category_FK) {
            const category = await categoryModel.findOne({
                where: { category_id: expense.category_FK, user_FK: req.user.user_id },
                transaction
            });
            if (category) {
                await category.decrement('category_allocated_amount', {
                    by: parseFloat(expense.expense_amount),
                    transaction
                });
            }
        }

        // Restar del gasto del presupuesto
        if (expense.budget_FK) {
            const budget = await budgetModel.findOne({
                where: { budget_id: expense.budget_FK, user_FK: req.user.user_id },
                transaction
            });
            if (budget) {
                await budget.decrement('budget_spent_amount', {
                    by: parseFloat(expense.expense_amount),
                    transaction
                });
            }
        }

        // Devolver el dinero a la cuenta (solo si existe)
        if (expense.account_FK) {
            const account = await accountModel.findOne({
                where: { account_id: expense.account_FK, user_FK: req.user.user_id },
                transaction
            });
            if (account) {
                await account.increment('account_balance', {
                    by: parseFloat(expense.expense_amount),
                    transaction
                });
            }
        }

        await expense.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting expense",
            error: error.message
        });
    }
};



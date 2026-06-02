import incomeModel from "../models/income.model.js";
import incomeAssignmentModel from "../models/incomeAssignment.model.js";
import goalModel from "../models/goal.model.js";
import debtModel from "../models/debt.model.js";
import budgetModel from "../models/budget.model.js";
import categoryModel from "../models/category.model.js";
import accountModel from "../models/account.model.js";
import sequelize from "../config/connect.db.js";

// Create Income (POST)
export const createIncome = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try{
        await incomeModel.sync();
        const dataIncome = req.body;
        const assignments = dataIncome.assignments || [];

        // Si no se envía income_date, usar la fecha actual
        if (!dataIncome.income_date) {
            dataIncome.income_date = new Date();
        }

        // Validar que las asignaciones no excedan el monto del ingreso
        const totalAssigned = assignments.reduce((sum, assignment) => sum + parseFloat(assignment.amount || 0), 0);
        if (totalAssigned > parseFloat(dataIncome.income_amount)) {
            await transaction.rollback();
            return res.status(400).json({
                ok: false,
                status: 400,
                message: `El total asignado (${totalAssigned}) excede el monto del ingreso (${dataIncome.income_amount})`
            });
        }

        // Validar cuenta solo si se proporcionó account_FK
        if (dataIncome.account_FK) {
            const account = await accountModel.findOne({
                where: { 
                    account_id: dataIncome.account_FK, 
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

            // Sumar el ingreso al saldo de la cuenta
            await account.increment('account_balance', { 
                by: parseFloat(dataIncome.income_amount), 
                transaction 
            });
        }

        // Crear el ingreso
        const newIncome = await incomeModel.create({
            income_name: dataIncome.income_name,
            income_amount: dataIncome.income_amount,
            income_date: dataIncome.income_date,
            income_description: dataIncome.income_description,
            user_FK: req.user.user_id,
            account_FK: dataIncome.account_FK || null,
            category_FK: dataIncome.category_FK || null,
        }, { transaction });

        // Procesar asignaciones si existen
        for (const assignment of assignments) {
            const { type, id, amount } = assignment;
            const assignAmount = parseFloat(amount);

            if (assignAmount <= 0) continue;

            // Guardar la asignación en la base de datos
            await incomeAssignmentModel.create({
                income_FK: newIncome.income_id,
                assignment_type: type,
                target_id: id,
                assigned_amount: assignAmount
            }, { transaction });

            switch (type) {
                case 'goal':
                    const goal = await goalModel.findOne({
                        where: { goal_id: id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (goal) {
                        await goal.increment('goal_current_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'debt':
                    const debt = await debtModel.findOne({
                        where: { debt_id: id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (debt) {
                        await debt.increment('debt_paid_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                        // Actualizar estado si la deuda está pagada
                        await debt.reload({ transaction });
                        if (parseFloat(debt.debt_paid_amount) >= parseFloat(debt.debt_amount)) {
                            await debt.update({ debt_status: 'pagada' }, { transaction });
                        }
                    }
                    break;

                case 'budget':
                    const budget = await budgetModel.findOne({
                        where: { budget_id: id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (budget) {
                        // Incrementar el presupuesto disponible (no el gastado)
                        await budget.increment('budget_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'category':
                    const category = await categoryModel.findOne({
                        where: { category_id: id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (category) {
                        await category.increment('category_allocated_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;
            }
        }

        // Ya no deducir el total asignado del saldo de la cuenta
        // El dinero se queda en la cuenta, las asignaciones son solo para clasificación

        await transaction.commit();

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Income created successfully",
            income: newIncome,
            assignments_processed: assignments.length
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message || "Error creating income",
            error: error.message
        });
    }
};

// Get All Incomes (GET) - Solo del usuario autenticado
export const getIncomes = async (req, res) => {
    try {
        await incomeModel.sync();

        // Filtrar solo los ingresos del usuario autenticado
        const incomes = await incomeModel.findAll({
            where: { user_FK: req.user.user_id }
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: incomes
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching incomes",
            error: error.message
        });
    }
};

// Get Income by ID (GET) - Solo si pertenece al usuario
export const getIncomeById = async (req, res) => {
    try {
        await incomeModel.sync();
        const { id } = req.params;

        // Buscar el ingreso Y verificar que pertenece al usuario
        const income = await incomeModel.findOne({
            where: {
                income_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!income) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Income not found or you don't have permission to access it"
            });
        }

        // Obtener las asignaciones del ingreso
        const assignments = await incomeAssignmentModel.findAll({
            where: { income_FK: id }
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                ...income.toJSON(),
                assignments: assignments.map(a => ({
                    type: a.assignment_type,
                    id: a.target_id,
                    amount: a.assigned_amount
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching income",
            error: error.message
        });
    }
};

// Update Income (PUT) - Solo si pertenece al usuario
export const updateIncome = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        await incomeModel.sync();
        const { id } = req.params;
        const dataIncome = req.body;
        const newAssignments = dataIncome.assignments || [];

        // Buscar el ingreso Y verificar que pertenece al usuario
        const income = await incomeModel.findOne({
            where: {
                income_id: id,
                user_FK: req.user.user_id
            },
            transaction
        });

        if (!income) {
            await transaction.rollback();
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Income not found or you don't have permission to modify it"
            });
        }

        // Validar que las asignaciones no excedan el monto del ingreso
        const totalAssigned = newAssignments.reduce((sum, assignment) => sum + parseFloat(assignment.amount || 0), 0);
        if (totalAssigned > parseFloat(dataIncome.income_amount)) {
            await transaction.rollback();
            return res.status(400).json({
                ok: false,
                status: 400,
                message: `El total asignado (${totalAssigned}) excede el monto del ingreso (${dataIncome.income_amount})`
            });
        }

        // Obtener la cuenta asociada (solo si existe)
        if (income.account_FK) {
            const account = await accountModel.findOne({
                where: { 
                    account_id: income.account_FK, 
                    user_FK: req.user.user_id 
                },
                transaction
            });

            if (account) {
                // Calcular diferencia en el monto del ingreso
                const oldAmount = parseFloat(income.income_amount);
                const newAmount = parseFloat(dataIncome.income_amount);
                const amountDifference = newAmount - oldAmount;

                // Ajustar el saldo de la cuenta si cambió el monto
                if (amountDifference !== 0) {
                    if (amountDifference > 0) {
                        await account.increment('account_balance', { 
                            by: amountDifference, 
                            transaction 
                        });
                    } else {
                        await account.decrement('account_balance', { 
                            by: Math.abs(amountDifference), 
                            transaction 
                        });
                    }
                }
            }
        }

        // PASO 1: Obtener y revertir asignaciones anteriores
        const oldAssignments = await incomeAssignmentModel.findAll({
            where: { income_FK: id },
            transaction
        });

        for (const oldAssignment of oldAssignments) {
            const assignAmount = parseFloat(oldAssignment.assigned_amount);
            
            switch (oldAssignment.assignment_type) {
                case 'goal':
                    const goal = await goalModel.findOne({
                        where: { goal_id: oldAssignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (goal) {
                        await goal.decrement('goal_current_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'debt':
                    const debt = await debtModel.findOne({
                        where: { debt_id: oldAssignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (debt) {
                        await debt.decrement('debt_paid_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                        // Actualizar estado si la deuda ya no está pagada
                        await debt.reload({ transaction });
                        if (parseFloat(debt.debt_paid_amount) < parseFloat(debt.debt_amount)) {
                            await debt.update({ debt_status: 'pendiente' }, { transaction });
                        }
                    }
                    break;

                case 'budget':
                    const budget = await budgetModel.findOne({
                        where: { budget_id: oldAssignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (budget) {
                        await budget.decrement('budget_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'category':
                    const category = await categoryModel.findOne({
                        where: { category_id: oldAssignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (category) {
                        await category.decrement('category_allocated_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;
            }
        }

        // Eliminar todas las asignaciones antiguas
        await incomeAssignmentModel.destroy({
            where: { income_FK: id },
            transaction
        });

        // PASO 2: Aplicar nuevas asignaciones
        for (const assignment of newAssignments) {
            const { type, id: assignId, amount } = assignment;
            const assignAmount = parseFloat(amount);

            if (assignAmount <= 0) continue;

            // Guardar la nueva asignación en la base de datos
            await incomeAssignmentModel.create({
                income_FK: id,
                assignment_type: type,
                target_id: assignId,
                assigned_amount: assignAmount
            }, { transaction });

            switch (type) {
                case 'goal':
                    const goal = await goalModel.findOne({
                        where: { goal_id: assignId, user_FK: req.user.user_id },
                        transaction
                    });
                    if (goal) {
                        await goal.increment('goal_current_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'debt':
                    const debt = await debtModel.findOne({
                        where: { debt_id: assignId, user_FK: req.user.user_id },
                        transaction
                    });
                    if (debt) {
                        await debt.increment('debt_paid_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                        // Actualizar estado si la deuda está pagada
                        await debt.reload({ transaction });
                        if (parseFloat(debt.debt_paid_amount) >= parseFloat(debt.debt_amount)) {
                            await debt.update({ debt_status: 'pagada' }, { transaction });
                        }
                    }
                    break;

                case 'budget':
                    const budget = await budgetModel.findOne({
                        where: { budget_id: assignId, user_FK: req.user.user_id },
                        transaction
                    });
                    if (budget) {
                        await budget.increment('budget_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'category':
                    const category = await categoryModel.findOne({
                        where: { category_id: assignId, user_FK: req.user.user_id },
                        transaction
                    });
                    if (category) {
                        await category.increment('category_allocated_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;
            }
        }

        // Actualizar los campos básicos del ingreso
        await income.update({
            income_name: dataIncome.income_name,
            income_amount: dataIncome.income_amount,
            income_date: dataIncome.income_date,
            income_description: dataIncome.income_description,
            category_FK: dataIncome.category_FK,
        }, { transaction });

        await transaction.commit();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Income updated successfully",
            income,
            assignments_processed: newAssignments.length
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating income",
            error: error.message
        });
    }
};

// Delete Income (DELETE) - Solo si pertenece al usuario
export const deleteIncome = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        await incomeModel.sync();
        const { id } = req.params;

        // Buscar el ingreso Y verificar que pertenece al usuario
        const income = await incomeModel.findOne({
            where: {
                income_id: id,
                user_FK: req.user.user_id
            },
            transaction
        });

        if (!income) {
            await transaction.rollback();
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Income not found or you don't have permission to delete it"
            });
        }

        // Obtener y revertir asignaciones antes de eliminar
        const assignments = await incomeAssignmentModel.findAll({
            where: { income_FK: id },
            transaction
        });

        for (const assignment of assignments) {
            const assignAmount = parseFloat(assignment.assigned_amount);
            
            switch (assignment.assignment_type) {
                case 'goal':
                    const goal = await goalModel.findOne({
                        where: { goal_id: assignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (goal) {
                        await goal.decrement('goal_current_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'debt':
                    const debt = await debtModel.findOne({
                        where: { debt_id: assignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (debt) {
                        await debt.decrement('debt_paid_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                        // Actualizar estado si la deuda ya no está pagada
                        await debt.reload({ transaction });
                        if (parseFloat(debt.debt_paid_amount) < parseFloat(debt.debt_amount)) {
                            await debt.update({ debt_status: 'pendiente' }, { transaction });
                        }
                    }
                    break;

                case 'budget':
                    const budget = await budgetModel.findOne({
                        where: { budget_id: assignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (budget) {
                        await budget.decrement('budget_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;

                case 'category':
                    const category = await categoryModel.findOne({
                        where: { category_id: assignment.target_id, user_FK: req.user.user_id },
                        transaction
                    });
                    if (category) {
                        await category.decrement('category_allocated_amount', { 
                            by: assignAmount, 
                            transaction 
                        });
                    }
                    break;
            }
        }

        // Restar el monto del ingreso del saldo de la cuenta (solo si existe)
        if (income.account_FK) {
            const account = await accountModel.findOne({
                where: { 
                    account_id: income.account_FK, 
                    user_FK: req.user.user_id 
                },
                transaction
            });

            if (account) {
                await account.decrement('account_balance', {
                    by: parseFloat(income.income_amount),
                    transaction
                });
            }
        }

        // Eliminar el ingreso (las asignaciones se eliminan automáticamente por CASCADE)
        await income.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Income deleted successfully"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting income",
            error: error.message
        });
    }
};
import BudgetModel from "../models/budget.model.js";

//create budget
export const createBudget = async (req, res) => {
    try {
        await BudgetModel.sync();
        const dataBudget = req.body;

        // Usar el user_id del usuario autenticado
        const createBudget = await BudgetModel.create({
            budget_name: dataBudget.budget_name,
            budget_amount: dataBudget.budget_amount,
            budget_currency: dataBudget.budget_currency,
            user_FK: req.user.user_id, // Forzar el ID del usuario autenticado
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Budget created successfully",
            budget: createBudget
        });
    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error creating budget",
            error: error.message
        });
    }
};

//get all budgets - Solo del usuario autenticado
export const getBudgets = async (req, res) => {
    try {
        await BudgetModel.sync();

        // Filtrar solo los presupuestos del usuario autenticado
        const budgets = await BudgetModel.findAll({
            where: { user_FK: req.user.user_id }
        });

        // Agregar campos calculados
        const budgetsWithCalculations = budgets.map(budget => {
            const budgetData = budget.toJSON();
            const spentAmount = parseFloat(budgetData.budget_spent_amount || 0);
            const totalAmount = parseFloat(budgetData.budget_amount || 0);
            
            return {
                ...budgetData,
                budget_remaining_amount: Math.max(0, totalAmount - spentAmount),
                budget_usage_percentage: totalAmount > 0 ? ((spentAmount / totalAmount) * 100).toFixed(2) : 0
            };
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: budgetsWithCalculations
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching budgets",
            error: error.message
        });
    }
};

//get budget by id - Solo si pertenece al usuario
export const getBudgetById = async (req, res) => {
    try {
        await BudgetModel.sync();
        const { id } = req.params;

        // Buscar el presupuesto Y verificar que pertenece al usuario
        const budget = await BudgetModel.findOne({
            where: {
                budget_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!budget) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Budget not found or you don't have permission to access it"
            });
        }

        // Agregar campos calculados
        const budgetData = budget.toJSON();
        const spentAmount = parseFloat(budgetData.budget_spent_amount || 0);
        const totalAmount = parseFloat(budgetData.budget_amount || 0);

        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                ...budgetData,
                budget_remaining_amount: Math.max(0, totalAmount - spentAmount),
                budget_usage_percentage: totalAmount > 0 ? ((spentAmount / totalAmount) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching budget",
            error: error.message
        });
    }
};

//update budget - Solo si pertenece al usuario
export const updateBudget = async (req, res) => {
    try {
        await BudgetModel.sync();
        const { id } = req.params;
        const dataBudget = req.body;

        // Buscar el presupuesto Y verificar que pertenece al usuario
        const budget = await BudgetModel.findOne({
            where: {
                budget_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!budget) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Budget not found or you don't have permission to modify it"
            });
        }

        await budget.update({
            budget_name: dataBudget.budget_name,
            budget_amount: dataBudget.budget_amount,
            budget_currency: dataBudget.budget_currency,
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Budget updated successfully",
            budget
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating budget",
            error: error.message
        });
    }
};

//delete budget - Solo si pertenece al usuario
export const deleteBudget = async (req, res) => {
    try {
        await BudgetModel.sync();
        const { id } = req.params;

        // Buscar el presupuesto Y verificar que pertenece al usuario
        const budget = await BudgetModel.findOne({
            where: {
                budget_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!budget) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Budget not found or you don't have permission to delete it"
            });
        }

        await budget.destroy();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Budget deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting budget",
            error: error.message
        });
    }
};

const BudgetController = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
};

export default BudgetController;

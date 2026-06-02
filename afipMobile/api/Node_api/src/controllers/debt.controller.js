import Debt from "../models/debt.model.js";

//create debt
export const createDebt = async (req, res) => {
    try {
        await Debt.sync();
        const dataDebt = req.body;

        // Usar el user_id del usuario autenticado
        const createDebt = await Debt.create({
            debt_name: dataDebt.debt_name,
            debt_amount: dataDebt.debt_amount,
            debt_currency: dataDebt.debt_currency,
            user_FK: req.user.user_id, // Forzar el ID del usuario autenticado
            debt_date: dataDebt.debt_date,
            debt_status: dataDebt.debt_status,
            debt_description: dataDebt.debt_description,
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Debt created successfully",
            debt: createDebt
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error creating debt",
            error: error.message
        });
    }
};

//get all debts - Solo del usuario autenticado
export const getDebts = async (req, res) => {
    try {
        await Debt.sync();

        // Filtrar solo las deudas del usuario autenticado
        const debts = await Debt.findAll({
            where: { user_FK: req.user.user_id }
        });

        // Agregar campos calculados
        const debtsWithCalculations = debts.map(debt => {
            const debtData = debt.toJSON();
            const paidAmount = parseFloat(debtData.debt_paid_amount || 0);
            const totalAmount = parseFloat(debtData.debt_amount || 0);
            
            return {
                ...debtData,
                debt_remaining_amount: Math.max(0, totalAmount - paidAmount),
                debt_payment_percentage: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : 0
            };
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: debtsWithCalculations
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching debts",
            error: error.message
        });
    }
};

//get debt by id - Solo si pertenece al usuario
export const getDebtById = async (req, res) => {
    try {
        await Debt.sync();
        const { id } = req.params;

        // Buscar la deuda Y verificar que pertenece al usuario
        const debt = await Debt.findOne({
            where: {
                debt_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!debt) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Debt not found or you don't have permission to access it"
            });
        }

        // Agregar campos calculados
        const debtData = debt.toJSON();
        const paidAmount = parseFloat(debtData.debt_paid_amount || 0);
        const totalAmount = parseFloat(debtData.debt_amount || 0);

        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                ...debtData,
                debt_remaining_amount: Math.max(0, totalAmount - paidAmount),
                debt_payment_percentage: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching debt",
            error: error.message
        });
    }
};

//update debt - Solo si pertenece al usuario
export const updateDebt = async (req, res) => {
    try {
        await Debt.sync();
        const { id } = req.params;
        const dataDebt = req.body;

        // Buscar la deuda Y verificar que pertenece al usuario
        const debt = await Debt.findOne({
            where: {
                debt_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!debt) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Debt not found or you don't have permission to modify it"
            });
        }

        await debt.update({
            debt_name: dataDebt.debt_name,
            debt_amount: dataDebt.debt_amount,
            debt_currency: dataDebt.debt_currency,
            debt_date: dataDebt.debt_date,
            debt_status: dataDebt.debt_status,
            debt_description: dataDebt.debt_description,
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Debt updated successfully",
            debt
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating debt",
            error: error.message
        });
    }
};

//delete debt - Solo si pertenece al usuario
export const deleteDebt = async (req, res) => {
    try {
        await Debt.sync();
        const { id } = req.params;

        // Buscar la deuda Y verificar que pertenece al usuario
        const debt = await Debt.findOne({
            where: {
                debt_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!debt) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Debt not found or you don't have permission to delete it"
            });
        }

        await debt.destroy();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Debt deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting debt",
            error: error.message
        });
    }
};

const DebtController = {
    createDebt,
    getDebts,
    getDebtById,
    updateDebt,
    deleteDebt
};

export default DebtController;

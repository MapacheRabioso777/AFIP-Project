import DebtPayment from "../models/debtPayment.model.js";

//create debt payment
export const createDebtPayment = async (req, res) => {
    try {
        const dataDebtPayment = req.body;
        const createDebtPayment = await DebtPayment.create({
            debtPayment_amount: dataDebtPayment.debtPayment_amount,
            debtPayment_date: dataDebtPayment.debtPayment_date,
            debtPayment_description: dataDebtPayment.debtPayment_description,
            debt_FK: dataDebtPayment.debt_FK,
        });
        res.status(201).json({
            message: "Debt payment created successfully",
            debtPayment: createDebtPayment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//get all debt payments
export const getAllDebtPayments = async (req, res) => {
    try {
        const dataDebtPayments = await DebtPayment.findAll();
        res.status(200).json(dataDebtPayments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//get debt payment by id
export const getDebtPaymentById = async (req, res) => {
    try {
        const dataDebtPayment = await DebtPayment.findByPk(req.params.id);
        if (!dataDebtPayment) {
            return res.status(404).json({ error: 'Debt payment not found' });
        }
        res.status(200).json(dataDebtPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//update debt payment
export const updateDebtPayment = async (req, res) => {
    try {
        const dataDebtPayment = await DebtPayment.findByPk(req.params.id);
        if (!dataDebtPayment) {
            return res.status(404).json({ error: 'Debt payment not found' });
        }
        await dataDebtPayment.update(req.body);
        res.status(200).json(dataDebtPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//delete debt payment
export const deleteDebtPayment = async (req, res) => {
    try {
        const dataDebtPayment = await DebtPayment.findByPk(req.params.id);
        if (!dataDebtPayment) {
            return res.status(404).json({ error: 'Debt payment not found' });
        }
        await dataDebtPayment.destroy();
        res.status(200).json({ message: 'Debt payment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
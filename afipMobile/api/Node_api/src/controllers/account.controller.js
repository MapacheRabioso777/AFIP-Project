import accountModel from "../models/account.model.js";

// Create Account (POST)
export const createAccount = async (req, res) => {
    try {
        await accountModel.sync();
        const dataAccount = req.body;

        // Usar el user_id del usuario autenticado (del token JWT)
        const newAccount = await accountModel.create({
            account_name: dataAccount.account_name,
            account_type: dataAccount.account_type,
            account_balance: dataAccount.account_balance,
            user_FK: req.user.user_id, // Forzar el ID del usuario autenticado
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Account created successfully",
            account: newAccount
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error creating account",
            error: error.message
        });
    }
};

// Get All Accounts (GET) - Solo del usuario autenticado
export const getAccounts = async (req, res) => {
    try {
        await accountModel.sync();

        // Filtrar solo las cuentas del usuario autenticado
        const accounts = await accountModel.findAll({
            where: { user_FK: req.user.user_id }
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: accounts
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching accounts",
            error: error.message
        });
    }
};

// Get Account by ID (GET) - Solo si pertenece al usuario
export const getAccountById = async (req, res) => {
    try {
        await accountModel.sync();
        const { id } = req.params;

        // Buscar la cuenta Y verificar que pertenece al usuario
        const account = await accountModel.findOne({
            where: {
                account_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!account) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Account not found or you don't have permission to access it"
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            body: account
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching account",
            error: error.message
        });
    }
};

// Update Account (PUT) - Solo si pertenece al usuario
export const updateAccount = async (req, res) => {
    try {
        await accountModel.sync();
        const { id } = req.params;
        const dataAccount = req.body;

        // Buscar la cuenta Y verificar que pertenece al usuario
        const account = await accountModel.findOne({
            where: {
                account_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!account) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Account not found or you don't have permission to modify it"
            });
        }

        await account.update({
            account_name: dataAccount.account_name,
            account_balance: dataAccount.account_balance,
            account_type: dataAccount.account_type,
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Account updated successfully",
            account
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating account",
            error: error.message
        });
    }
};

// Delete Account (DELETE) - Solo si pertenece al usuario
export const deleteAccount = async (req, res) => {
    try {
        await accountModel.sync();
        const { id } = req.params;

        // Buscar la cuenta Y verificar que pertenece al usuario
        const account = await accountModel.findOne({
            where: {
                account_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!account) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Account not found or you don't have permission to delete it"
            });
        }

        await account.destroy();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Account deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting account",
            error: error.message
        });
    }
};
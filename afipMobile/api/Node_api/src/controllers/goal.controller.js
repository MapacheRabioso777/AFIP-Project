import goalModel from "../models/goal.model.js";

// Create Goal (POST)
export const createGoal = async (req, res) => {
    try {
        await goalModel.sync();
        const dataGoal = req.body;

        // Log para debug
        console.log('=== CREATE GOAL DEBUG ===');
        console.log('Request body:', JSON.stringify(dataGoal, null, 2));
        console.log('User from token:', req.user);
        console.log('========================');

        // Usar el user_id del usuario autenticado
        const newGoal = await goalModel.create({
            goal_name: dataGoal.goal_name,
            goal_amount: dataGoal.goal_amount,
            goal_target_date: dataGoal.goal_target_date,
            goal_description: dataGoal.goal_description,
            user_FK: req.user.user_id, // Forzar el ID del usuario autenticado
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Goal created successfully",
            goal: newGoal
        });
    } catch (error) {
        console.error('=== CREATE GOAL ERROR ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);

        // Log validación de Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            console.error('Validation errors:', error.errors?.map(e => ({
                field: e.path,
                message: e.message,
                value: e.value
            })));
        }

        console.error('Error stack:', error.stack);
        console.error('Request body:', req.body);
        console.error('User from token:', req.user);
        console.error('========================');

        // Mensaje de error más específico
        let errorMessage = "Error creating goal";
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = "Ya existe una meta con ese nombre. Por favor usa un nombre diferente.";
        } else if (error.name === 'SequelizeValidationError') {
            errorMessage = error.errors?.map(e => e.message).join(', ') || "Validation error";
        }

        res.status(500).json({
            ok: false,
            status: 500,
            message: errorMessage,
            error: error.message
        });
    }
};

// Get All Goals (GET) - Solo del usuario autenticado
export const getGoals = async (req, res) => {
    try {
        await goalModel.sync();

        // Filtrar solo las metas del usuario autenticado
        const goals = await goalModel.findAll({
            where: { user_FK: req.user.user_id }
        });

        // Agregar campos calculados
        const goalsWithCalculations = goals.map(goal => {
            const goalData = goal.toJSON();
            const currentAmount = parseFloat(goalData.goal_current_amount || 0);
            const targetAmount = parseFloat(goalData.goal_amount || 0);
            
            return {
                ...goalData,
                goal_remaining_amount: Math.max(0, targetAmount - currentAmount),
                goal_progress_percentage: targetAmount > 0 ? ((currentAmount / targetAmount) * 100).toFixed(2) : 0
            };
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: goalsWithCalculations
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching goals",
            error: error.message
        });
    }
};

// Get Goal by ID (GET) - Solo si pertenece al usuario
export const getGoalById = async (req, res) => {
    try {
        await goalModel.sync();
        const { id } = req.params;

        // Buscar la meta Y verificar que pertenece al usuario
        const goal = await goalModel.findOne({
            where: {
                goal_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!goal) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Goal not found or you don't have permission to access it"
            });
        }

        // Agregar campos calculados
        const goalData = goal.toJSON();
        const currentAmount = parseFloat(goalData.goal_current_amount || 0);
        const targetAmount = parseFloat(goalData.goal_amount || 0);

        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                ...goalData,
                goal_remaining_amount: Math.max(0, targetAmount - currentAmount),
                goal_progress_percentage: targetAmount > 0 ? ((currentAmount / targetAmount) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching goal",
            error: error.message
        });
    }
};

// Update Goal (PUT) - Solo si pertenece al usuario
export const updateGoal = async (req, res) => {
    try {
        await goalModel.sync();
        const { id } = req.params;
        const dataGoal = req.body;

        // Buscar la meta Y verificar que pertenece al usuario
        const goal = await goalModel.findOne({
            where: {
                goal_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!goal) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Goal not found or you don't have permission to modify it"
            });
        }

        await goal.update({
            goal_name: dataGoal.goal_name,
            goal_amount: dataGoal.goal_amount,
            goal_target_date: dataGoal.goal_target_date,
            goal_description: dataGoal.goal_description,
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Goal updated successfully",
            goal
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating goal",
            error: error.message
        });
    }
};

// Delete Goal (DELETE) - Solo si pertenece al usuario
export const deleteGoal = async (req, res) => {
    try {
        await goalModel.sync();
        const { id } = req.params;

        // Buscar la meta Y verificar que pertenece al usuario
        const goal = await goalModel.findOne({
            where: {
                goal_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!goal) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Goal not found or you don't have permission to delete it"
            });
        }

        await goal.destroy();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Goal deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting goal",
            error: error.message
        });
    }
};
import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class IncomeAssignment extends Model { }

IncomeAssignment.init({
    assignment_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    income_FK: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'incomes',
            key: 'income_id'
        },
        onDelete: 'CASCADE', // Si se elimina el ingreso, se eliminan sus asignaciones
        onUpdate: 'CASCADE',
    },
    assignment_type: {
        type: DataTypes.ENUM('debt', 'budget', 'goal', 'category'),
        allowNull: false,
    },
    target_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'ID of the assigned entity (debt_id, budget_id, goal_id, or category_id)'
    },
    assigned_amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "incomeAssignment",
    tableName: "income_assignments",
    timestamps: true,
});

export default IncomeAssignment;

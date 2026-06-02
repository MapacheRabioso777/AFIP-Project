import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Budget extends Model { }

Budget.init({

    budget_id: { // ID del presupuesto
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    budget_name: { // Nombre del presupuesto
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget_amount: { // Monto del presupuesto
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    budget_currency: { // Moneda del presupuesto
        type: DataTypes.STRING,
        defaultValue: 'COP',
        allowNull: true,
    },
    budget_spent_amount: { // Monto gastado del presupuesto
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    user_FK: { // Llave foránea - Usuario propietario del presupuesto
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus presupuestos
        onUpdate: 'CASCADE',
    },

}, {
    sequelize,
    modelName: "budget",
    tableName: "budgets",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_FK', 'budget_name'], // Nombre único por usuario
            name: 'unique_budget_per_user'
        }
    ]
})

export default Budget;


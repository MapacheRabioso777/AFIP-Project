import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Debt extends Model { }

Debt.init({
    debt_id: { // ID de la deuda
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    debt_name: { // Nombre de la deuda
        type: DataTypes.STRING,
        allowNull: false,
    },
    debt_amount: { // Monto de la deuda
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    debt_currency: { // Moneda de la deuda
        type: DataTypes.STRING,
        defaultValue: 'COP',
        allowNull: true,
    },
    debt_date: { // Fecha de la deuda
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
    },
    debt_status: { // Estado de la deuda (pendiente, pagada, etc.)
        type: DataTypes.STRING,
        defaultValue: 'pendiente',
        allowNull: true,
    },
    debt_description: { // Descripción de la deuda
        type: DataTypes.STRING,
        allowNull: true,
    },
    debt_paid_amount: { // Monto pagado de la deuda
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    user_FK: { // Llave foránea - Usuario propietario de la deuda
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus deudas
        onUpdate: 'CASCADE',
    },

}, {
    sequelize,
    modelName: "debt",
    tableName: "debts",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_FK', 'debt_name'],
            name: 'unique_debt_per_user'
        }
    ]
})

export default Debt;

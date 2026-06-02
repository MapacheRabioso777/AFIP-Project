import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class DebtPayment extends Model { }

DebtPayment.init({
    debtPayment_id: { // ID del pago de deuda
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    debtPayment_amount: { // Monto del pago de deuda
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    debtPayment_date: { // Fecha del pago de deuda
        type: DataTypes.DATE,
        allowNull: true,
    },
    debtPayment_description: { // Descripción del pago de deuda
        type: DataTypes.STRING,
        allowNull: true,
    },
    debt_FK: { // Llave foránea - Deuda a la que pertenece el pago
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'debts',
            key: 'debt_id'
        },
        onDelete: 'CASCADE', // Si se elimina la deuda, se eliminan sus pagos
        onUpdate: 'CASCADE',
    },
}, {
    sequelize,
    modelName: "debtPayment",
    tableName: "debtPayments",
    timestamps: true,
})

export default DebtPayment;
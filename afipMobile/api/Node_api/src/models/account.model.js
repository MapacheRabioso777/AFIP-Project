import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Account extends Model { }

Account.init(
    {
        account_id: { // ID de la cuenta
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        account_name: { // Nombre de la cuenta
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_type: { // Tipo de cuenta (ahorros, corriente, etc.)
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_balance: { // Saldo de la cuenta
            type: DataTypes.BIGINT,
            defaultValue: 0,
            allowNull: false,
        },
        account_currency: { // Moneda de la cuenta
            type: DataTypes.STRING,
            defaultValue: 'COP',
            allowNull: true,
        },
        user_FK: { // Llave foránea - Usuario propietario de la cuenta
            type: DataTypes.UUID, //
            allowNull: false,
            references: {
                model: 'users', // Nombre exacto de la tabla
                key: 'user_id'
            },
            onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus cuentas
            onUpdate: 'CASCADE',
        },

    }, {
    sequelize,
    modelName: "account",
    tableName: "accounts",
    timestamps: true,
});

export default Account;
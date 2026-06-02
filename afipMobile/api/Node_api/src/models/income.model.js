import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Income extends Model { }

Income.init(
    {
        income_id: { // ID del ingreso
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        income_name: { // Nombre del ingreso
            type: DataTypes.STRING,
            allowNull: false,
        },
        income_amount: { // Monto del ingreso
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        income_description: { // Descripción del ingreso
            type: DataTypes.STRING,
            allowNull: true,
        },
        income_date: { // Fecha del ingreso
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        user_FK: { // Llave foránea - Usuario propietario del ingreso
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus ingresos
            onUpdate: 'CASCADE',
        },
        account_FK: { // Llave foránea - Cuenta en la que se recibe el ingreso
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'accounts',
                key: 'account_id'
            },
            onDelete: "CASCADE", // Si se elimina la cuenta, se eliminan sus ingresos
            onUpdate: "CASCADE"
        },
        category_FK: { // Llave foránea - Categoría del ingreso
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'category_id'
            },
            onDelete: "SET NULL", // Si se elimina la categoría, se pone en null
            onUpdate: "CASCADE"
        },

    }, {
    sequelize,
    modelName: "income",
    tableName: "incomes",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_FK', 'income_name'],
            name: 'unique_income_per_user'
        }
    ]
});

export default Income;
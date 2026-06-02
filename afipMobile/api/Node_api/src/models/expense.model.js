import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Expense extends Model { }

Expense.init(
    {
        expense_id: { // ID del gasto
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        expense_name: { // Nombre del gasto
            type: DataTypes.STRING,
            allowNull: false,
        },
        expense_amount: { // Monto del gasto
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        expense_description: { // Descripción del gasto
            type: DataTypes.STRING,
            allowNull: true,
        },
        expense_date: { // Fecha del gasto
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        user_FK: { // Llave foránea - Usuario propietario del gasto
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus gastos
            onUpdate: 'CASCADE',
        },
        category_FK: { // Llave foránea - Categoría del gasto
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'category_id'
            },
            onDelete: "RESTRICT", // No permite eliminar categoría si tiene gastos asociados
            onUpdate: "CASCADE"
        },
        account_FK: { // Llave foránea - Cuenta de la que se realizó el gasto
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'accounts',
                key: 'account_id'
            },
            onDelete: "CASCADE", // Si se elimina la cuenta, se eliminan sus gastos
            onUpdate: "CASCADE"
        },
        budget_FK: { // Llave foránea - Presupuesto asociado al gasto (OPCIONAL)
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true, // Ahora es opcional
            references: {
                model: 'budgets',
                key: 'budget_id'
            },
            onDelete: "SET NULL", // Si se elimina el presupuesto, se pone en NULL
            onUpdate: "CASCADE"
        },

    }, {
    sequelize,
    modelName: "expense",
    tableName: "expenses",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_FK', 'expense_name'],
            name: 'unique_expense_per_user'
        }
    ]
});

export default Expense;
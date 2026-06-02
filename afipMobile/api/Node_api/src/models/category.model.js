import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Category extends Model { }

Category.init(
    {
        category_id: { // ID de la categoría
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        category_name: { // Nombre de la categoría
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_description: { // Descripción de la categoría
            type: DataTypes.STRING,
            allowNull: true,
        },
        category_type: { // Tipo de categoría: ingreso o gasto
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
            defaultValue: 'expense',
        },
        category_allocated_amount: { // Monto asignado a la categoría
            type: DataTypes.BIGINT,
            defaultValue: 0,
            allowNull: false,
        },
        category_is_predefined: { // Marca si es una categoría predefinida del sistema
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        user_FK: { // Llave foránea - Usuario propietario de la categoría
            type: DataTypes.UUID, // 
            allowNull: false,
            references: {
                model: 'users', // Nombre exacto de la tabla
                key: 'user_id'
            },
            onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus categorías
            onUpdate: 'CASCADE',
        },
    }, {
        sequelize,
    modelName: "category",
    tableName: "categories",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user_FK', 'category_name', 'category_type'],
            name: 'unique_category_per_user_and_type'
        }
    ]
});

export default Category;
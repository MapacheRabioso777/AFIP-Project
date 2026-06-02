import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class User extends Model { }

User.init(
    {
        user_id: { // ID del usuario (UUID)
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_user: { // Email
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_password: { // Contraseña del usuario (encriptada)
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "user",
        tableName: "users",
        timestamps: true,
    });
export default User;

import sequelize from "../config/connect.db.js";
import { Model, DataTypes } from "sequelize";

class Goal extends Model {}

Goal.init(
  {
    goal_id: {
      // ID de la meta
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    goal_name: {
      // Nombre de la meta
      type: DataTypes.STRING,
      allowNull: false,
    },
    goal_amount: {
      // Monto objetivo de la meta
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    goal_target_date: {
      // Fecha objetivo para cumplir la meta
      type: DataTypes.DATE,
      allowNull: false,
    },
    goal_description: {
      // Descripción de la meta
      type: DataTypes.STRING,
      allowNull: true,
    },
    goal_current_amount: {
      // Monto actual ahorrado para la meta
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    user_FK: {
      // Llave foránea - Usuario propietario de la meta
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE", // Si se elimina el usuario, se eliminan sus metas
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "goal",
    tableName: "goals",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_FK", "goal_name"],
        name: "unique_goal_per_user",
      },
    ],
  }
);

export default Goal;

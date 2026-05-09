"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {

      // =========================
      // Usuario -> Mesas
      // =========================
      Usuario.hasMany(models.Mesa, {
        foreignKey: "mozoId",
        as: "mesasAsignadas",
      });

    }
  }

  Usuario.init(
    {
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      legajo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      rol: {
        type: DataTypes.ENUM(
          "admin",
          "mozo",
          "cocinero",
          "cajero"
        ),
        allowNull: false,
        defaultValue: "mozo",
      },

      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      timestamps: false,
      underscored: true,
    }
  );

  return Usuario;
};

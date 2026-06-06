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

      // =========================
      // Usuario -> Roles
      // =========================
      Usuario.belongsTo(models.Rol, {
        foreignKey: "rolId",
        as: "rol",
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

      rolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "rol_id",
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

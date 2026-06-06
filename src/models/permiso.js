"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permiso extends Model {
    static associate(models) {

      Permiso.belongsToMany(models.Rol, {
        through: "roles_permisos",
        foreignKey: "permiso_id",
        otherKey: "rol_id",
        as: "roles",
      });

    }
  }

  Permiso.init(
    {
      codigo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      descripcion: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "Permiso",
      tableName: "permisos",
      timestamps: false,
      underscored: true,
    }
  );

  return Permiso;
};
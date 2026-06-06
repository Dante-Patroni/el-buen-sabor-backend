"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {

      Rol.belongsToMany(models.Permiso, {
        through: "roles_permisos",
        foreignKey: "rol_id",
        otherKey: "permiso_id",
        as: "permisos",
      });

      Rol.hasMany(models.Usuario, {
        foreignKey: "rolId",
        as: "usuarios",
      });
    }
  }


  Rol.init(
    {
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      descripcion: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "Rol",
      tableName: "roles",
      timestamps: false,
      underscored: true,
    }
  );

  return Rol;
};
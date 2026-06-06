"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles_permisos", {
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "roles",
          key: "id",
        },

        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      permiso_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "permisos",
          key: "id",
        },

        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });

    await queryInterface.addConstraint(
      "roles_permisos",
      {
        fields: ["rol_id", "permiso_id"],
        type: "primary key",
        name: "pk_roles_permisos",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("roles_permisos");
  },
};
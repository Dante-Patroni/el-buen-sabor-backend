"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", [
      {
        id: 1,
        nombre: "superadmin",
        descripcion: "Acceso total al sistema",
      },
      {
        id: 2,
        nombre: "admin",
        descripcion: "Administrador del restaurante",
      },
      {
        id: 3,
        nombre: "cajero",
        descripcion: "Operador de caja",
      },
      {
        id: 4,
        nombre: "cocinero",
        descripcion: "Operador de cocina",
      },
      {
        id: 5,
        nombre: "mozo",
        descripcion: "Atención de mesas y pedidos",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
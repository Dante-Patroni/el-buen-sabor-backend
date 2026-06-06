"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("permisos", [
      { id: 1, codigo: "PEDIDO_CREAR" },
      { id: 2, codigo: "PEDIDO_VER" },
      { id: 3, codigo: "PEDIDO_MODIFICAR" },
      { id: 4, codigo: "PEDIDO_ELIMINAR" },
      { id: 5, codigo: "PEDIDO_CAMBIAR_ESTADO" },

      { id: 6, codigo: "MESA_VER" },
      { id: 7, codigo: "MESA_ABRIR" },
      { id: 8, codigo: "SOLICITAR_COBRO" },
      { id: 9, codigo: "MESA_CERRAR" },

      { id: 10, codigo: "TICKET_VER" },
      { id: 11, codigo: "MESA_COBRAR" },

      { id: 12, codigo: "PLATO_CREAR" },
      { id: 13, codigo: "PLATO_VER" },
      { id: 14, codigo: "PLATO_MODIFICAR" },
      { id: 15, codigo: "PLATO_ELIMINAR" },

      { id: 16, codigo: "RUBRO_CREAR" },
      { id: 17, codigo: "RUBRO_VER" },
      { id: 18, codigo: "RUBRO_MODIFICAR" },
      { id: 19, codigo: "RUBRO_ELIMINAR" },

      { id: 20, codigo: "USUARIO_CREAR" },
      { id: 21, codigo: "USUARIO_VER" },
      { id: 22, codigo: "USUARIO_MODIFICAR" },
      { id: 23, codigo: "USUARIO_ELIMINAR" },

      { id: 24, codigo: "REPORTE_VER" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("permisos", null, {});
  },
};
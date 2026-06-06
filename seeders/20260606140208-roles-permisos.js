"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  /**
   * @description Asigna permisos a cada rol del sistema.
   * superadmin -> todos los permisos
   * admin      -> gestión de datos (platos, rubros, usuarios, reportes, ver pedidos)
   * cajero     -> operaciones de caja y cierre de mesa
   * cocinero   -> visualización de pedidos y platos
   * mozo       -> gestión de mesas y pedidos
   */
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles_permisos", [

      // ================================
      // ROL 1 — superadmin (todos)
      // ================================
      ...Array.from({ length: 24 }, (_, i) => ({
        rol_id: 1,
        permiso_id: i + 1,
      })),

      // ================================
      // ROL 2 — admin
      // ================================
      { rol_id: 2, permiso_id: 2  }, // PEDIDO_VER
      { rol_id: 2, permiso_id: 12 }, // PLATO_CREAR
      { rol_id: 2, permiso_id: 13 }, // PLATO_VER
      { rol_id: 2, permiso_id: 14 }, // PLATO_MODIFICAR
      { rol_id: 2, permiso_id: 15 }, // PLATO_ELIMINAR
      { rol_id: 2, permiso_id: 16 }, // RUBRO_CREAR
      { rol_id: 2, permiso_id: 17 }, // RUBRO_VER
      { rol_id: 2, permiso_id: 18 }, // RUBRO_MODIFICAR
      { rol_id: 2, permiso_id: 19 }, // RUBRO_ELIMINAR
      { rol_id: 2, permiso_id: 20 }, // USUARIO_CREAR
      { rol_id: 2, permiso_id: 21 }, // USUARIO_VER
      { rol_id: 2, permiso_id: 22 }, // USUARIO_MODIFICAR
      { rol_id: 2, permiso_id: 23 }, // USUARIO_ELIMINAR
      { rol_id: 2, permiso_id: 24 }, // REPORTE_VER

      // ================================
      // ROL 3 — cajero
      // ================================
      { rol_id: 3, permiso_id: 2  }, // PEDIDO_VER
      { rol_id: 3, permiso_id: 6  }, // MESA_VER
      { rol_id: 3, permiso_id: 9  }, // MESA_CERRAR
      { rol_id: 3, permiso_id: 10 }, // TICKET_VER
      { rol_id: 3, permiso_id: 11 }, // MESA_COBRAR

      // ================================
      // ROL 4 — cocinero
      // ================================
      { rol_id: 4, permiso_id: 2  }, // PEDIDO_VER
      { rol_id: 4, permiso_id: 13 }, // PLATO_VER

      // ================================
      // ROL 5 — mozo
      // ================================
      { rol_id: 5, permiso_id: 1  }, // PEDIDO_CREAR
      { rol_id: 5, permiso_id: 2  }, // PEDIDO_VER
      { rol_id: 5, permiso_id: 6  }, // MESA_VER
      { rol_id: 5, permiso_id: 7  }, // MESA_ABRIR
      { rol_id: 5, permiso_id: 8  }, // SOLICITAR_COBRO
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles_permisos", null, {});
  },
};
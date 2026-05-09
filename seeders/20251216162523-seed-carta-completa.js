"use strict";

const bcrypt = require("bcryptjs");

const NOMBRES_PLATOS_SEED = [
  "Hamburguesa Clasica",
  "Hamburguesa Buen Sabor",
  "Pizza Muzzarella",
  "Pizza Especial",
  "Empanada Carne",
  "Coca-Cola 500ml",
  "Cerveza Andes IPA",
];

/**
 * @description Inserta registros y actualiza columnas si ya existe una clave primaria o unica.
 * @param {import("sequelize").QueryInterface} queryInterface - Interfaz de Sequelize para operar la base.
 * @param {string} tabla - Nombre de la tabla destino.
 * @param {Array<object>} registros - Registros a insertar o actualizar.
 * @param {Array<string>} columnasActualizables - Columnas que se actualizan ante duplicados.
 * @returns {Promise<void>} Promesa resuelta al completar la operacion.
 */
async function insertarOActualizar(
  queryInterface,
  tabla,
  registros,
  columnasActualizables
) {
  await queryInterface.bulkInsert(tabla, registros, {
    updateOnDuplicate: columnasActualizables,
  });
}

/**
 * @description Crea o actualiza platos del seed usando nombre como identificador funcional.
 * @param {import("sequelize").QueryInterface} queryInterface - Interfaz de Sequelize para operar la base.
 * @param {Array<object>} platos - Platos que deben quedar disponibles en la carta.
 * @returns {Promise<void>} Promesa resuelta al sincronizar todos los platos.
 */
async function sincronizarPlatosPorNombre(queryInterface, platos) {
  for (const plato of platos) {
    const [existentes] = await queryInterface.sequelize.query(
      "SELECT id FROM platos WHERE nombre = :nombre LIMIT 1",
      {
        replacements: { nombre: plato.nombre },
      }
    );

    if (existentes.length > 0) {
      const datosActualizados = {
        ...plato,
        updated_at: new Date(),
      };
      delete datosActualizados.created_at;

      await queryInterface.bulkUpdate(
        "platos",
        datosActualizados,
        { id: existentes[0].id },
        {}
      );
      continue;
    }

    await queryInterface.bulkInsert("platos", [plato]);
  }
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  /**
   * @description Carga datos base de carta, rubros, usuario administrador y mesa demo sin duplicarlos.
   * @param {import("sequelize").QueryInterface} queryInterface - Interfaz de Sequelize para operar la base.
   * @param {import("sequelize")} Sequelize - Instancia de tipos y utilidades Sequelize provista por CLI.
   * @returns {Promise<void>} Promesa resuelta al finalizar la carga inicial.
   */
  async up(queryInterface, Sequelize) {
    const ahora = new Date();
    const passwordHash = await bcrypt.hash("1234", 10);

    await insertarOActualizar(
      queryInterface,
      "usuarios",
      [
        {
          nombre: "Dante",
          apellido: "Admin",
          legajo: "1001",
          password: passwordHash,
          rol: "admin",
          activo: true,
        },
      ],
      ["nombre", "apellido", "password", "rol", "activo"]
    );

    await insertarOActualizar(
      queryInterface,
      "mesas",
      [
        {
          id: 4,
          numero: "4",
          nombre: "Mesa 4",
          estado: "libre",
          mozo_id: null,
          created_at: ahora,
          updated_at: ahora,
        },
      ],
      ["numero", "nombre", "estado", "mozo_id", "updated_at"]
    );

    await insertarOActualizar(
      queryInterface,
      "rubros",
      [
        {
          id: 1,
          denominacion: "Cocina",
          padre_id: null,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
        {
          id: 2,
          denominacion: "Bebidas",
          padre_id: null,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
      ],
      ["denominacion", "padre_id", "activo", "updated_at"]
    );

    await insertarOActualizar(
      queryInterface,
      "rubros",
      [
        {
          id: 4,
          denominacion: "Hamburguesas",
          padre_id: 1,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
        {
          id: 5,
          denominacion: "Pizzas",
          padre_id: 1,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
        {
          id: 6,
          denominacion: "Empanadas",
          padre_id: 1,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
        {
          id: 9,
          denominacion: "Sin Alcohol",
          padre_id: 2,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
        {
          id: 10,
          denominacion: "Cervezas",
          padre_id: 2,
          activo: true,
          created_at: ahora,
          updated_at: ahora,
        },
      ],
      ["denominacion", "padre_id", "activo", "updated_at"]
    );

    await sincronizarPlatosPorNombre(queryInterface, [
      {
        nombre: "Hamburguesa Clasica",
        precio: 4500,
        descripcion: "Medallon de carne, lechuga, tomate y mayonesa.",
        rubro_id: 4,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: false,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
      {
        nombre: "Hamburguesa Buen Sabor",
        precio: 6200,
        descripcion: "Doble carne, cheddar, bacon, huevo y salsa especial.",
        rubro_id: 4,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: true,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
      {
        nombre: "Pizza Muzzarella",
        precio: 7000,
        descripcion: "Salsa de tomate, muzzarella y oregano.",
        rubro_id: 5,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: false,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
      {
        nombre: "Pizza Especial",
        precio: 8500,
        descripcion: "Jamon cocido, morrones y aceitunas.",
        rubro_id: 5,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: true,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
      {
        nombre: "Empanada Carne",
        precio: 900,
        descripcion: "Carne cortada a cuchillo, suave.",
        rubro_id: 6,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: false,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
      {
        nombre: "Coca-Cola 500ml",
        precio: 1800,
        descripcion: "Botella de plastico descartable.",
        rubro_id: 9,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: false,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
      {
        nombre: "Cerveza Andes IPA",
        precio: 2800,
        descripcion: "Lata 473ml. Rubia amarga.",
        rubro_id: 10,
        es_activo: true,
        stock_actual: 100,
        es_ilimitado: false,
        es_menu_del_dia: true,
        imagen_path: "",
        created_at: ahora,
        updated_at: ahora,
      },
    ]);
  },

  /**
   * @description Revierte solo los datos creados por este seed respetando dependencias por clave foranea.
   * @param {import("sequelize").QueryInterface} queryInterface - Interfaz de Sequelize para operar la base.
   * @param {import("sequelize")} Sequelize - Instancia de tipos y utilidades Sequelize provista por CLI.
   * @returns {Promise<void>} Promesa resuelta al finalizar la reversion del seed.
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("platos", {
      nombre: NOMBRES_PLATOS_SEED,
    });

    await queryInterface.bulkDelete("rubros", {
      id: [4, 5, 6, 9, 10],
    });

    await queryInterface.bulkDelete("rubros", {
      id: [1, 2],
    });

    await queryInterface.bulkDelete("mesas", {
      id: 4,
    });

    await queryInterface.bulkDelete("usuarios", {
      legajo: "1001",
    });
  },
};

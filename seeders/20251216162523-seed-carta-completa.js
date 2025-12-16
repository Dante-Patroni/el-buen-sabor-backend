'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Platos', [
      // --- HAMBURGUESAS (Rubro ID 4) ---
      {
        nombre: 'Hamburguesa Clásica',
        precio: 4500,
        descripcion: 'Medallón de carne, lechuga, tomate y mayonesa.',
        rubroId: 4, 
        esMenuDelDia: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        nombre: 'Hamburguesa Buen Sabor',
        precio: 6200,
        descripcion: 'Doble carne, cheddar, bacon, huevo y salsa especial.',
        rubroId: 4,
        esMenuDelDia: true, // 🔥 DESTACADO DEL DÍA
        createdAt: new Date(), updatedAt: new Date()
      },

      // --- PIZZAS (Rubro ID 5) ---
      {
        nombre: 'Pizza Muzzarella',
        precio: 7000,
        descripcion: 'Salsa de tomate, muzzarella y orégano.',
        rubroId: 5,
        esMenuDelDia: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        nombre: 'Pizza Especial',
        precio: 8500,
        descripcion: 'Jamón cocido, morrones y aceitunas.',
        rubroId: 5,
        esMenuDelDia: true, // 🔥 DESTACADO DEL DÍA
        createdAt: new Date(), updatedAt: new Date()
      },

      // --- EMPANADAS (Rubro ID 6) ---
      {
        nombre: 'Empanada Carne',
        precio: 900,
        descripcion: 'Carne cortada a cuchillo, suave.',
        rubroId: 6,
        esMenuDelDia: false,
        createdAt: new Date(), updatedAt: new Date()
      },

      // --- BEBIDAS SIN ALCOHOL (Rubro ID 9) ---
      {
        nombre: 'Coca-Cola 500ml',
        precio: 1800,
        descripcion: 'Botella de plástico descartable.',
        rubroId: 9,
        esMenuDelDia: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      
      // --- CERVEZAS (Rubro ID 10) ---
      {
        nombre: 'Cerveza Andes IPA',
        precio: 2800,
        descripcion: 'Lata 473ml. Rubia amarga.',
        rubroId: 10,
        esMenuDelDia: true, // 🔥 PROMO DEL DÍA
        createdAt: new Date(), updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Platos', null, {});
  }
};
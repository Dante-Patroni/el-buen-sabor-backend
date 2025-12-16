'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // ===============================================
    // 1. PRIMERO: CREAMOS LOS RUBROS (Categorías)
    // ===============================================
    // Es vital poner los IDs manuales para que coincidan con los platos de abajo.
    
    await queryInterface.bulkInsert('Rubros', [
      // --- PADRES ---
      { id: 1, denominacion: 'Cocina', padreId: null, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, denominacion: 'Bebidas', padreId: null, activo: true, createdAt: new Date(), updatedAt: new Date() },
      
      // --- HIJOS DE COCINA (Padre ID 1) ---
      { id: 4, denominacion: 'Hamburguesas', padreId: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, denominacion: 'Pizzas', padreId: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, denominacion: 'Empanadas', padreId: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      
      // --- HIJOS DE BEBIDAS (Padre ID 2) ---
      { id: 9, denominacion: 'Sin Alcohol', padreId: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 10, denominacion: 'Cervezas', padreId: 2, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // ===============================================
    // 2. SEGUNDO: CREAMOS LOS PLATOS
    // ===============================================
    // Ahora sí funcionará porque los IDs 4, 5, 6, 9 y 10 ya existen arriba.

    await queryInterface.bulkInsert('Platos', [
      // --- HAMBURGUESAS (Rubro ID 4) ---
      {
        nombre: 'Hamburguesa Clásica',
        precio: 4500,
        descripcion: 'Medallón de carne, lechuga, tomate y mayonesa.',
        rubroId: 4, 
        esMenuDelDia: false,
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        nombre: 'Hamburguesa Buen Sabor',
        precio: 6200,
        descripcion: 'Doble carne, cheddar, bacon, huevo y salsa especial.',
        rubroId: 4,
        esMenuDelDia: true, // 🔥 DESTACADO DEL DÍA
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      },

      // --- PIZZAS (Rubro ID 5) ---
      {
        nombre: 'Pizza Muzzarella',
        precio: 7000,
        descripcion: 'Salsa de tomate, muzzarella y orégano.',
        rubroId: 5,
        esMenuDelDia: false,
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        nombre: 'Pizza Especial',
        precio: 8500,
        descripcion: 'Jamón cocido, morrones y aceitunas.',
        rubroId: 5,
        esMenuDelDia: true, // 🔥 DESTACADO DEL DÍA
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      },

      // --- EMPANADAS (Rubro ID 6) ---
      {
        nombre: 'Empanada Carne',
        precio: 900,
        descripcion: 'Carne cortada a cuchillo, suave.',
        rubroId: 6,
        esMenuDelDia: false,
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      },

      // --- BEBIDAS SIN ALCOHOL (Rubro ID 9) ---
      {
        nombre: 'Coca-Cola 500ml',
        precio: 1800,
        descripcion: 'Botella de plástico descartable.',
        rubroId: 9,
        esMenuDelDia: false,
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      },
      
      // --- CERVEZAS (Rubro ID 10) ---
      {
        nombre: 'Cerveza Andes IPA',
        precio: 2800,
        descripcion: 'Lata 473ml. Rubia amarga.',
        rubroId: 10,
        esMenuDelDia: true, // 🔥 PROMO DEL DÍA
        imagenPath: '',
        createdAt: new Date(), updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    // IMPORTANTE: Primero borramos los HIJOS (Platos) para no romper la relación
    await queryInterface.bulkDelete('Platos', null, {});
    // Luego borramos los PADRES (Rubros)
    await queryInterface.bulkDelete('Rubros', null, {});
  }
};
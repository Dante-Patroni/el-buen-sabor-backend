'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ===============================================
    // LIMPIEZA PREVIA (orden inverso por FKs)
    // ===============================================
    await queryInterface.bulkDelete('detallePedidos', null, {});
    await queryInterface.bulkDelete('pedidos', null, {});
    await queryInterface.bulkDelete('platos', null, {});
    await queryInterface.bulkDelete('rubros', null, {});
    await queryInterface.bulkDelete('mesas', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});

    // ===============================================
    // 1. USUARIOS
    // ===============================================
    const adminPassword = await bcrypt.hash('admin123', 10);
    const mozoPassword = await bcrypt.hash('mozo123', 10);
    const cocineroPassword = await bcrypt.hash('cocinero123', 10);
    const cajeroPassword = await bcrypt.hash('cajero123', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        id: 1,
        nombre: 'Dante',
        apellido: 'Admin',
        legajo: 'ADMIN001',
        password: adminPassword,
        rol: 'admin',
        activo: true
      },
      {
        id: 2,
        nombre: 'Juan',
        apellido: 'Perez',
        legajo: 'MOZO001',
        password: mozoPassword,
        rol: 'mozo',
        activo: true
      },
      {
        id: 3,
        nombre: 'Maria',
        apellido: 'Gomez',
        legajo: 'MOZO002',
        password: mozoPassword,
        rol: 'mozo',
        activo: true
      },
      {
        id: 4,
        nombre: 'Carlos',
        apellido: 'Chef',
        legajo: 'COC001',
        password: cocineroPassword,
        rol: 'cocinero',
        activo: true
      },
      {
        id: 5,
        nombre: 'Lucia',
        apellido: 'Cajera',
        legajo: 'CAJ001',
        password: cajeroPassword,
        rol: 'cajero',
        activo: true
      }
    ]);

    // ===============================================
    // 2. MESAS (sin total_actual)
    // ===============================================
    await queryInterface.bulkInsert('mesas', [
      { id: 1, numero: '1', nombre: 'Mesa 1', estado: 'libre', mozo_id: null },
      { id: 2, numero: '2', nombre: 'Mesa 2', estado: 'libre', mozo_id: null },
      { id: 3, numero: '3', nombre: 'Mesa 3', estado: 'libre', mozo_id: null },
      { id: 4, numero: '4', nombre: 'Mesa 4', estado: 'libre', mozo_id: 2 },
      { id: 5, numero: '5', nombre: 'Mesa 5', estado: 'libre', mozo_id: null },
      { id: 6, numero: '6', nombre: 'Mesa 6', estado: 'libre', mozo_id: 3 },
      { id: 7, numero: '7', nombre: 'Mesa 7', estado: 'libre', mozo_id: null },
      { id: 8, numero: '8', nombre: 'Mesa 8', estado: 'libre', mozo_id: null }
    ]);

    // ===============================================
    // 3. RUBROS (Categorías)
    // ===============================================
    await queryInterface.bulkInsert('rubros', [
      { id: 1, denominacion: 'Cocina', padreId: null, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, denominacion: 'Bebidas', padreId: null, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, denominacion: 'Hamburguesas', padreId: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, denominacion: 'Pizzas', padreId: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, denominacion: 'Empanadas', padreId: 1, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 9, denominacion: 'Sin Alcohol', padreId: 2, activo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 10, denominacion: 'Cervezas', padreId: 2, activo: true, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // ===============================================
    // 4. PLATOS
    // ===============================================
    await queryInterface.bulkInsert('platos', [
      {
        id: 1,
        nombre: 'Hamburguesa Clásica',
        precio: 4500.00,
        descripcion: 'Medallón de carne, lechuga, tomate y mayonesa.',
        rubroId: 4, 
        esMenuDelDia: false,
        imagenPath: '',
        esActivo: true,
        stockActual: 50,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 2,
        nombre: 'Hamburguesa Buen Sabor',
        precio: 6200.00,
        descripcion: 'Doble carne, cheddar, bacon, huevo y salsa especial.',
        rubroId: 4,
        esMenuDelDia: true,
        imagenPath: '',
        esActivo: true,
        stockActual: 30,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 3,
        nombre: 'Pizza Muzzarella',
        precio: 7000.00,
        descripcion: 'Salsa de tomate, muzzarella y orégano.',
        rubroId: 5,
        esMenuDelDia: false,
        imagenPath: '',
        esActivo: true,
        stockActual: 20,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 4,
        nombre: 'Pizza Especial',
        precio: 8500.00,
        descripcion: 'Jamón cocido, morrones y aceitunas.',
        rubroId: 5,
        esMenuDelDia: true,
        imagenPath: '',
        esActivo: true,
        stockActual: 15,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 5,
        nombre: 'Empanada Carne',
        precio: 900.00,
        descripcion: 'Carne cortada a cuchillo, suave.',
        rubroId: 6,
        esMenuDelDia: false,
        imagenPath: '',
        esActivo: true,
        stockActual: 100,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 6,
        nombre: 'Coca-Cola 500ml',
        precio: 1800.00,
        descripcion: 'Botella de plástico descartable.',
        rubroId: 9,
        esMenuDelDia: false,
        imagenPath: '',
        esActivo: true,
        stockActual: 200,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 7,
        nombre: 'Cerveza Andes IPA',
        precio: 2800.00,
        descripcion: 'Lata 473ml. Rubia amarga.',
        rubroId: 10,
        esMenuDelDia: true,
        imagenPath: '',
        esActivo: true,
        stockActual: 80,
        esIlimitado: false,
        createdAt: new Date(), updatedAt: new Date()
      }
    ]);

    console.log('✅ Seed completo ejecutado: usuarios, mesas, rubros y platos');
  },

  async down(queryInterface, Sequelize) {
    // Limpieza en orden inverso (por FKs)
    await queryInterface.bulkDelete('platos', null, {});
    await queryInterface.bulkDelete('rubros', null, {});
    await queryInterface.bulkDelete('mesas', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};

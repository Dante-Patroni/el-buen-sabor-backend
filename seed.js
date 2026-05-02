'use strict';

require('dotenv').config({ path: './src/.env' });
if (!process.env.DB_DATABASE) require('dotenv').config();

const bcrypt = require('bcryptjs');
const models = require('./src/models');

async function seed() {
  const { sequelize } = models;
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida.');

    // Desactivar verificación de FK temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    console.log('🧹 Limpiando datos existentes...');
    await sequelize.query('TRUNCATE TABLE detallePedidos');
    await sequelize.query('TRUNCATE TABLE pedidos');
    await sequelize.query('TRUNCATE TABLE platos');
    await sequelize.query('TRUNCATE TABLE rubros');
    await sequelize.query('TRUNCATE TABLE mesas');
    await sequelize.query('TRUNCATE TABLE usuarios');
    console.log('✅ Limpieza completa.');

    // 1. Usuarios
    console.log('👤 Creando usuarios...');
    await models.Usuario.bulkCreate([
      {
        id: 1,
        nombre: 'Dante',
        apellido: 'Admin',
        legajo: 'ADMIN001',
        password: await bcrypt.hash('admin123', 10),
        rol: 'admin',
        activo: true
      },
      {
        id: 2,
        nombre: 'Juan',
        apellido: 'Perez',
        legajo: 'MOZO001',
        password: await bcrypt.hash('mozo123', 10),
        rol: 'mozo',
        activo: true
      },
      {
        id: 3,
        nombre: 'Maria',
        apellido: 'Gomez',
        legajo: 'MOZO002',
        password: await bcrypt.hash('mozo123', 10),
        rol: 'mozo',
        activo: true
      },
      {
        id: 4,
        nombre: 'Carlos',
        apellido: 'Chef',
        legajo: 'COC001',
        password: await bcrypt.hash('cocinero123', 10),
        rol: 'cocinero',
        activo: true
      },
      {
        id: 5,
        nombre: 'Lucia',
        apellido: 'Cajera',
        legajo: 'CAJ001',
        password: await bcrypt.hash('cajero123', 10),
        rol: 'cajero',
        activo: true
      }
    ]);
    console.log('✅ 5 usuarios creados.');

    // 2. Mesas (sin total_actual)
    console.log('🪑 Creando mesas...');
    await models.Mesa.bulkCreate([
      { id: 1, numero: '1', nombre: 'Mesa 1', estado: 'libre', mozo_id: null },
      { id: 2, numero: '2', nombre: 'Mesa 2', estado: 'libre', mozo_id: null },
      { id: 3, numero: '3', nombre: 'Mesa 3', estado: 'libre', mozo_id: null },
      { id: 4, numero: '4', nombre: 'Mesa 4', estado: 'libre', mozo_id: 2 },
      { id: 5, numero: '5', nombre: 'Mesa 5', estado: 'libre', mozo_id: null },
      { id: 6, numero: '6', nombre: 'Mesa 6', estado: 'libre', mozo_id: 3 },
      { id: 7, numero: '7', nombre: 'Mesa 7', estado: 'libre', mozo_id: null },
      { id: 8, numero: '8', nombre: 'Mesa 8', estado: 'libre', mozo_id: null }
    ]);
    console.log('✅ 8 mesas creadas.');

    // 3. Rubros
    console.log('📋 Creando rubros...');
    await models.Rubro.bulkCreate([
      { id: 1, denominacion: 'Cocina', padreId: null, activo: true },
      { id: 2, denominacion: 'Bebidas', padreId: null, activo: true },
      { id: 4, denominacion: 'Hamburguesas', padreId: 1, activo: true },
      { id: 5, denominacion: 'Pizzas', padreId: 1, activo: true },
      { id: 6, denominacion: 'Empanadas', padreId: 1, activo: true },
      { id: 9, denominacion: 'Sin Alcohol', padreId: 2, activo: true },
      { id: 10, denominacion: 'Cervezas', padreId: 2, activo: true }
    ]);
    console.log('✅ 7 rubros creados.');

    // 4. Platos
    console.log('🍔 Creando platos...');
    await models.Plato.bulkCreate([
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
        esIlimitado: false
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
        esIlimitado: false
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
        esIlimitado: false
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
        esIlimitado: false
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
        esIlimitado: false
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
        esIlimitado: false
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
        esIlimitado: false
      }
    ]);
    console.log('✅ 7 platos creados.');

    // Reactivar verificación de FK
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n🎉 SEEDER COMPLETO EJECUTADO EXITOSAMENTE');
    console.log('\n📝 Credenciales:');
    console.log('   Admin: legajo ADMIN001, password admin123');
    console.log('   Mozo: legajo MOZO001, password mozo123');
    console.log('   Mozo: legajo MOZO002, password mozo123');

  } catch (error) {
    console.error('\n❌ ERROR durante el seedeo:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seed();

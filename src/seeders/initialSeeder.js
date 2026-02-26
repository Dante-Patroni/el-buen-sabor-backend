// src/seeders/initialSeeder.js
const { Usuario, Mesa, Plato, Rubro } = require('../models'); // 👈 Agregamos Rubro
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log("🌱 [Seeder] Iniciando sembrado de datos...");

        // ==========================================
        // 1. SEMBRAR USUARIO ADMIN
        // ==========================================
        const adminExiste = await Usuario.findOne({ where: { legajo: '1001' } });
        if (!adminExiste) {
            console.log("🌱 [Seeder] Creando usuario Admin...");
            const passwordHash = await bcrypt.hash('1234', 10);
            await Usuario.create({
                nombre: 'Dante',
                apellido: 'Admin',
                legajo: '1001',
                password: passwordHash,
                rol: 'admin',
                activo: true
            });
            console.log('✅ [Seeder] Usuario Admin CREADO.');
        }

        // ==========================================
        // 2. SEMBRAR MESA 4
        // ==========================================
        const mesa4 = await Mesa.findByPk(4);
        
        if (!mesa4) {
            console.log("🌱 [Seeder] Creando Mesa 4...");
            await Mesa.create({
                id: 4,          
                nombre: 'Mesa 4',
                capacidad: 4,
                estado: 'LIBRE',
                mozoId: null 
            });
            console.log('✅ [Seeder] Mesa 4 CREADA.');
        }

        // ==========================================
        // 3. SEMBRAR RUBRO (Necesario para el plato)
        // ==========================================
        // Verificamos si existe el rubro Cocina (ID 1) o creamos uno genérico
        let rubroCocina = await Rubro.findByPk(1);
        
        if (!rubroCocina) {
            console.log("🌱 [Seeder] Creando Rubro 'Cocina'...");
            rubroCocina = await Rubro.create({
                id: 1,
                denominacion: 'Cocina',
                padreId: null,
                activo: true
            });
            console.log('✅ [Seeder] Rubro Cocina CREADO.');
        }

        // ==========================================
        // 4. SEMBRAR PLATO (Con Rubro asociado)
        // ==========================================
        const plato1 = await Plato.findByPk(1);

        if (!plato1) {
            console.log("🌱 [Seeder] Creando Plato 1 (Hamburguesa)...");
            await Plato.create({
                id: 1,
                nombre: 'Hamburguesa Test',
                precio: 1500,
                descripcion: 'Hamburguesa de prueba para desarrollo local.', // Nuevo campo
                imagenPath: '', // Cambiado de imagenUrl a imagenPath (según tu modelo actual)
                activo: true,
                rubroId: rubroCocina.id, // 👈 ¡CRUCIAL! Vinculamos con el rubro
                esMenuDelDia: false      // Nuevo campo
            });
            console.log('✅ [Seeder] Plato 1 CREADO.');
        }

        console.log("🌱 [Seeder] Proceso finalizado correctamente.");

    } catch (error) {
        console.error('❌ [Seeder] Error FATAL durante el sembrado:', error);
    }
};

module.exports = seedDatabase;

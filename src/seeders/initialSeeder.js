// src/seeders/initialSeeder.js
const { Usuario, Mesa } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log("🌱 [Seeder] Iniciando sembrado de datos...");

        // Verificación de seguridad: ¿Cargaron los modelos?
        if (!Usuario || !Mesa) {
            console.error("❌ [Seeder] Error Crítico: Los modelos Usuario o Mesa son undefined. Revisa las importaciones.");
            return;
        }

        // 1. SEMBRAR USUARIO ADMIN
        const adminExiste = await Usuario.findOne({ where: { legajo: '1001' } });
        
       if (!adminExiste) {
            console.log("🌱 [Seeder] Creando usuario Admin (Dante)...");
            const passwordHash = await bcrypt.hash('1234', 10);
            
            await Usuario.create({
                nombre: 'Dante',
                apellido: 'Admin',
                legajo: '1001',
                email: 'admin@elbuensabor.com',
                password: passwordHash,
                rol: 'admin'  // 👈 ¡AQUÍ ESTÁ LA CORRECCIÓN! (Antes decía 'administrador')
            });
            console.log('✅ [Seeder] Usuario Admin CREADO.');
        }

        // 2. SEMBRAR MESA 4
        const mesaExiste = await Mesa.findOne({ where: { numero: '4' } }); 
        
        if (!mesaExiste) {
            console.log("🌱 [Seeder] Creando Mesa 4...");
            await Mesa.create({
                numero: '4', 
                capacidad: 4,
                estado: 'LIBRE' 
            });
            console.log('✅ [Seeder] Mesa 4 CREADA.');
        } else {
            console.log('ℹ️ [Seeder] La Mesa 4 ya existía.');
        }

        console.log("🌱 [Seeder] Proceso finalizado correctamente.");

    } catch (error) {
        console.error('❌ [Seeder] Error FATAL durante el sembrado:', error);
    }
};

module.exports = seedDatabase;
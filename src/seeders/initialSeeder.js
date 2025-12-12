// src/seeders/initialSeeder.js
const { Usuario, Mesa } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // 1. CREAR USUARIO ADMIN (Si no existe)
        const adminExiste = await Usuario.findOne({ where: { legajo: '1001' } });
        
        if (!adminExiste) {
            console.log("🌱 Creando usuario Admin...");
            // Encriptamos '1234'
            const passwordHash = await bcrypt.hash('1234', 10);
            
            await Usuario.create({
                nombre: 'Dante',
                apellido: 'Admin',
                legajo: '1001',
                email: 'admin@elbuensabor.com',
                password: passwordHash,
                rol: 'administrador' 
            });
            console.log('✅ Usuario Admin (1001) sembrado con éxito.');
        }

        // 2. CREAR MESA 4 (Para el test de pedidos)
        // Buscamos por número (string) porque así lo definimos en el modelo
        const mesaExiste = await Mesa.findOne({ where: { numero: '4' } }); 
        
        if (!mesaExiste) {
             console.log("🌱 Creando Mesa 4...");
            await Mesa.create({
                numero: '4', 
                capacidad: 4,
                estado: 'LIBRE' 
            });
            console.log('✅ Mesa 4 sembrada con éxito.');
        }

    } catch (error) {
        console.error('❌ Error en el seeding inicial:', error);
    }
};

module.exports = seedDatabase;
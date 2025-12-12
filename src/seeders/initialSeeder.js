// src/seeders/initialSeeder.js
const { Usuario, Mesa, Plato } = require('../models'); // 👈 Agregamos Plato
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log("🌱 [Seeder] Iniciando sembrado de datos...");

        // 1. SEMBRAR USUARIO ADMIN
        const adminExiste = await Usuario.findOne({ where: { legajo: '1001' } });
        if (!adminExiste) {
            console.log("🌱 [Seeder] Creando usuario Admin...");
            const passwordHash = await bcrypt.hash('1234', 10);
            await Usuario.create({
                nombre: 'Dante',
                apellido: 'Admin',
                legajo: '1001',
                email: 'admin@elbuensabor.com',
                password: passwordHash,
                rol: 'admin'
            });
            console.log('✅ [Seeder] Usuario Admin CREADO.');
        }

        // 2. SEMBRAR MESA 4 (Corrección: Usamos 'id' y 'nombre')
        // El test busca la mesa con ID 4 o Nombre "4". Forzamos el ID 4.
        const mesa4 = await Mesa.findByPk(4);
        
        if (!mesa4) {
            console.log("🌱 [Seeder] Creando Mesa 4...");
            await Mesa.create({
                id: 4,          // Forzamos el ID 4 para que coincida con el Test
                nombre: 'Mesa 4', // Usamos 'nombre' en vez de 'numero'
                capacidad: 4,
                estado: 'LIBRE',
                mozoId: null // Aseguramos que arranque libre
            });
            console.log('✅ [Seeder] Mesa 4 CREADA.');
        }

        // 3. SEMBRAR PLATO (Hamburguesa) - ¡NUEVO!
        // El test necesita un plato (ID 1) para crear el pedido.
        const plato1 = await Plato.findByPk(1);

        if (!plato1) {
            console.log("🌱 [Seeder] Creando Plato 1 (Hamburguesa)...");
            await Plato.create({
                id: 1,
                nombre: 'Hamburguesa Test',
                precio: 1500,
                ingredientePrincipal: 'Carne',
                imagenUrl: 'https://via.placeholder.com/150',
                activo: true
            });
            console.log('✅ [Seeder] Plato 1 CREADO.');
        }

        console.log("🌱 [Seeder] Proceso finalizado correctamente.");

    } catch (error) {
        console.error('❌ [Seeder] Error FATAL durante el sembrado:', error);
    }
};

module.exports = seedDatabase;
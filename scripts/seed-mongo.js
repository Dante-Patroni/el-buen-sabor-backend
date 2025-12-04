const mongoose = require('mongoose');
require('dotenv').config();

// Importamos el modelo actualizado
const Stock = require('../src/models/mongo/Stock'); 

const seedMongo = async () => {
    try {
        // Usamos la URI local por defecto si no hay variable de entorno
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/el_buen_sabor_test';
        console.log(`🌱 Conectando a Mongo...`);
        
        await mongoose.connect(uri);

        // 1. Limpiar la colección vieja para evitar errores
        await Stock.deleteMany({});

        // 2. Insertar el Stock de la Hamburguesa Clásica (ID 2)
        // Esto coincide con el Plato ID 2 de MySQL
        await Stock.create({
            platoId: 2,
            nombrePlato: 'Hamburguesa Clásica',
            stockDiario: {
                cantidadInicial: 50,
                cantidadActual: 50, // ✅ ¡50 disponibles para el test!
                esIlimitado: false
            }
        });

        console.log('✅ MongoDB Sembrado: Hamburguesa Clásica (ID 2) con stock 50.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error sembrando Mongo:', error);
        process.exit(1);
    }
};

seedMongo();
const mongoose = require('mongoose');
require('dotenv').config(); // Cargar las variables del archivo .env

const dbConnection = async () => {
    try {
        // Leemos la URL secreta
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('🌱 Base de datos MongoDB: ONLINE');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        throw new Error('Error al iniciar la base de datos');
    }
};

module.exports = {
    dbConnection
};
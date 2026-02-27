const mongoose = require("mongoose");
require("dotenv").config(); // [A] Carga las variables del archivo .env a la memoria

/**
 * @description Establece conexion a MongoDB usando la URI definida en variables de entorno.
 * @returns {Promise<void>} Conexion inicializada sin valor de retorno.
 * @throws {Error} `Error al iniciar la base de datos` cuando falla la conexion.
 */
const dbConnection = async () => {
  try {
    // [B] Uso de la Variable de Entorno
    // process.env es un objeto global de Node.js donde viven las variables del sistema.
    // MONGO_URI es la clave que definiste en el archivo oculto.
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🌱 Base de datos MongoDB: ONLINE");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw new Error("Error al iniciar la base de datos"); // [C] Fail Fast
  }
};

module.exports = {
  dbConnection,
};

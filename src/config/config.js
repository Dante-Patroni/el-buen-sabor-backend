require("dotenv").config(); // Carga variables de entorno locales si existen

module.exports = {
  // [A] Entorno de DESARROLLO (La PC)
  development: {
    // El operador || (OR) funciona como un "Fallback" (Plan B).
    // "Intenta leer DB_USERNAME del .env. Si no existe, usa 'root'".
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "el_buen_sabor_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  // [B] Entorno de TESTING (GitHub Actions / CI)
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root", // GitHub suele usar root/root
    database: process.env.DB_DATABASE || "el_buen_sabor_test", // BD separada para no borrar la real
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false, // [C] Silencio
  },

  // [D] Entorno de PRODUCCIÓN (El Servidor Real)
  production: {
    use_env_variable: "DATABASE_URL", // En prod, solemos usar una sola URL larga
    dialect: "mysql",
  },
};

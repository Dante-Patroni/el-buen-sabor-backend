require('dotenv').config(); // Carga variables de entorno locales si existen

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
   database: process.env.DB_DATABASE || 'el_buen_sabor_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root', // GitHub usa esto
    database: process.env.DB_DATABASE || 'el_buen_sabor_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql'
  }
};
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Estándar Open API
    info: {
      title: 'API El Buen Sabor',
      version: '1.0.0',
      description: 'API para gestión de pedidos de restaurante. Documentación automática.',
      contact: {
        name: 'Dante Patroni',
        url: 'https://github.com/Dante-Patroni/el-buen-sabor-backend.git', // Puedes poner tu GitHub real
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
  },
  // 👇 Aquí le decimos: "Busca anotaciones en todos los archivos de rutas"
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API El Buen Sabor",
      version: "1.0.0",
      description: "API para gestión de pedidos de restaurante. Documentación automática.",
      contact: {
        name: "Dante Patroni",
        url: "https://github.com/Dante-Patroni/el-buen-sabor-backend.git",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desarrollo",
      },
    ],
    // 👇 CAMBIO IMPORTANTE AQUÍ 👇
    components: {
      // 1. Definimos CÓMO es la seguridad (El tipo de candado)
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // 2. Tus esquemas de datos (Se quedan igual)
      schemas: {
        Plato: {
          type: "object",
          properties: {
            stock: {
              type: "object",
              properties: {
                cantidad: { type: "integer", example: 20 },
                esIlimitado: { type: "boolean", example: false },
                estado: { type: "string", example: "DISPONIBLE" },
              },
            },
          },
        },
      },
    },
    // 3. Activamos el candado globalmente
    security: [
      {
        bearerAuth: [],
      },
    ],
    // 👆 FIN DEL CAMBIO
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
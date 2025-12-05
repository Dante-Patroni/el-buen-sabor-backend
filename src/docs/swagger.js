const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Estándar Open API
    info: {
      title: "API El Buen Sabor",
      version: "1.0.0",
      description:
        "API para gestión de pedidos de restaurante. Documentación automática.",
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
    // 👇 AGREGA ESTO AQUÍ: Definición de componentes globales
    components: {
      schemas: {
        Plato: {
          type: "object",
          properties: {
            // Puedes agregar aquí otras propiedades del plato si quieres (nombre, precio, etc.)
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
    // 👆 Fin del agregado
  },
  // 👇 Aquí le decimos: "Busca anotaciones en todos los archivos de rutas"
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

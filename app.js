const express = require("express"); // 🆕 1. Importamos Express
const path = require("path");
const cors = require("cors"); //Seguridad
const { dbConnection } = require("./src/config/mongo"); // 🆕 1. Importamos la conexión Mongo
const { sequelize } = require("./src/models"); // 🆕 1. Importamos la conexión SQL
const setupListeners = require("./src/listeners/setupListeners");
const mesaRouter = require("./src/routes/mesaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//CONFIGURACIONES DE CORS RESTRICTIVAS
const whitelist = [
  "http://localhost:3000", // React Local(Postman/Swager)
  "http://localhost:4200", // Angular/React Local (Navegador)
  "http://192.168.1.37:3000", // IP Local para Celular o Tablet
  "http://192.168.1.37", // Dominio de Producción por si acaso
];
const corsOptions = {
  origin: function (origin, callback) {
    // Si no hay origen (como Postman o App móvil nativa) o está en la lista, permitimos
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Bloqueado por por CORS: Origen no permitido"));
    }
  },
  optionsSuccessStatus: 200, // Para legacy browsers
};

//Middlewares
app.use(cors()); // 1. Permite que el celular o React hablen con el servidor.
app.use(express.json()); // 2. Traduce el cuerpo del mensaje a JSON (si no, recibirías basura binaria)
app.use("/api/mesas", mesaRouter); // Rutas de mesas

// // 3. La Puerta de las Fotos
// Esto permite acceder a http://localhost:3000/uploads/foto.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. La Puerta de la Documentación
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/docs/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// BLOQUE 3: El Arranque Asíncrono (startServer)
const startServer = async () => {
  try {
    // PASO A: Conectar Mongo (Esperamos con await)
    await dbConnection();

    // PASO B: Conectar MySQL (Esperamos con await)
    // { force: false } significa "No borres las tablas si ya existen".
    // Usamos 'alter: true' para que agregue la columna 'total' sin borrar los datos
    await sequelize.sync({ alter: true });
    //await sequelize.sync({ force: false });
    console.log("📦 Tablas MySQL sincronizadas");

    // sync con alter:true actualiza las tablas si cambiaste algo
    await sequelize.sync({ force: false, alter: true }); 

    // EJECUTAR EL SEMBRADOR AQUÍ
    await seedDatabase();

    // PASO C: Activar los Oídos (Eventos)
    setupListeners();

    // PASO D: Si todo lo anterior funcionó, RECIÉN AHÍ abrimos el puerto
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor 'El Buen Sabor' corriendo.`);
      console.log(`📡 Accesible localmente en: http://localhost:${PORT}`);
      console.log(`📡 Accesible en red (Celular): http://<TU_IP_PC>:${PORT}`); // Ej: 192.168.1.37
      console.log(`📄 Documentación: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer(); // Ejecutamos la función de inicio

// BLOQUE 4: El Enrutador (Routing)
app.use("/api/pedidos", require("./src/routes/pedidoRoutes"));
app.use("/api/platos", require("./src/routes/platoRoutes"));
app.use("/api/usuarios", require("./src/routes/usuarioRoutes"));

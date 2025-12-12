const express = require("express");
const path = require("path");
const cors = require("cors");

// 👇 IMPORTACIONES DE BASE DE DATOS Y CONFIGURACIÓN
const { dbConnection } = require("./src/config/mongo");
const { sequelize } = require("./src/models");
const setupListeners = require("./src/listeners/setupListeners");
const seedDatabase = require("./src/seeders/initialSeeder"); // ✅ Ruta correcta

// 👇 IMPORTACIONES DE RUTAS
const mesaRouter = require("./src/routes/mesaRoutes");
// (Las otras rutas las importaremos directamente abajo para mantener tu estilo)

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🛡️ 1. SEGURIDAD (CORS)
// ==========================================
const whitelist = [
  "http://localhost:3000",      // Postman / Swagger / Frontend Local
  "http://localhost:4200",      // Angular Local
  "http://192.168.18.3:3000",   // 📱 TU CELULAR (IP Fija actualizada)
  "http://192.168.18.3",        // Variaciones de IP
];

const corsOptions = {
  origin: function (origin, callback) {
    // !origin permite peticiones sin origen (como Apps móviles nativas o Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("🚫 Bloqueado por CORS:", origin);
      callback(new Error("Bloqueado por CORS: Origen no permitido"));
    }
  },
  optionsSuccessStatus: 200,
};

// APLICAMOS MIDDLEWARES GLOBALES
app.use(cors(corsOptions)); // ✅ AHORA SÍ usa la configuración restrictiva
app.use(express.json());    // Traduce JSON

// ==========================================
// 📂 2. RUTAS Y DOCUMENTACIÓN
// ==========================================

// Archivos estáticos (Fotos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Documentación (Swagger)
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/docs/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API Routes
app.use("/api/mesas", mesaRouter);
app.use("/api/pedidos", require("./src/routes/pedidoRoutes"));
app.use("/api/platos", require("./src/routes/platoRoutes"));
app.use("/api/usuarios", require("./src/routes/usuarioRoutes"));

// ==========================================
// 🚀 3. INICIO DEL SERVIDOR
// ==========================================
const startServer = async () => {
  try {
    // A. Conectar Mongo
    await dbConnection();

    // B. Conectar MySQL y Sincronizar
    // alter: true actualiza las tablas si agregas columnas nuevas
    await sequelize.sync({ force: false, alter: true });
    console.log("📦 Tablas MySQL sincronizadas");

    // C. Sembrar datos iniciales (Admin y Mesas)
    await seedDatabase();

    // D. Activar Eventos (Sockets/Listeners)
    setupListeners();

    // E. Levantar el Servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor 'El Buen Sabor' corriendo.`);
      console.log(`📡 Accesible localmente: http://localhost:${PORT}`);
      console.log(`📡 Accesible en red:    http://192.168.18.3:${PORT}`);
      console.log(`📄 Documentación:       http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error("❌ Error fatal al iniciar el servidor:", error);
  }
};

startServer();
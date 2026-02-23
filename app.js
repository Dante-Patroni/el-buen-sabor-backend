const express = require("express");
const http = require("http"); // 🆕 NECESARIO PARA SOCKETS
const { Server } = require("socket.io"); // 🆕 LIBRERÍA DE TIEMPO REAL
const path = require("path");
const cors = require("cors");

// 👇 IMPORTACIONES DE BASE DE DATOS Y CONFIGURACIÓN
const { dbConnection } = require("./src/config/mongo");
const { sequelize } = require("./src/models");
const setupListeners = require("./src/listeners/setupListeners");
const seedDatabase = require("./src/seeders/initialSeeder");

// 👇 IMPORTACIONES DE RUTAS
const mesaRouter = require("./src/routes/mesaRoutes");

// Cargar variables de entorno
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET no está definido en .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🛡️ 1. SEGURIDAD (CORS - Express)
// ==========================================
const whitelist = [
  "http://localhost:3000",      
  "http://localhost:4200",      
  "http://192.168.18.3:3000",   
  "http://192.168.18.3",        
  "http://127.0.0.1:5500"       // ✅ Monitor de Cocina
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("🚫 Bloqueado por CORS:", origin);
      callback(new Error("Bloqueado por CORS: Origen no permitido"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// 📡 2. CONFIGURACIÓN WEBSOCKETS (LO QUE FALTABA)
// ==========================================
// Creamos un servidor HTTP nativo que envuelve a Express
const server = http.createServer(app);

// Configuramos Socket.io sobre ese servidor
const io = new Server(server, {
    cors: {
        origin: "*", // 🔓 Permitimos todo para que el HTML local conecte sin problemas
        methods: ["GET", "POST"]
    }
});

// ==========================================
// 📂 3. RUTAS
// ==========================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/docs/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/mesas", mesaRouter);
app.use("/api/pedidos", require("./src/routes/pedidoRoutes"));
app.use("/api/platos", require("./src/routes/platoRoutes"));
app.use("/api/usuarios", require("./src/routes/usuarioRoutes"));
app.use('/api/rubros', require('./src/routes/rubroRoutes'));

// ==========================================
// 🚀 4. INICIO DEL SERVIDOR
// ==========================================
const startServer = async () => {
  try {
    await dbConnection();
 
    await sequelize.sync({ force: false, alter: false });
    console.log("📦 Tablas MySQL sincronizadas");
    await seedDatabase();

    // 👇 IMPORTANTE: Pasamos 'io' para que los eventos puedan salir
    setupListeners(io); 

    // 👇 IMPORTANTE: Usamos 'server.listen', NO 'app.listen'
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor 'El Buen Sabor' corriendo.`);
      console.log(`📡 Accesible localmente: http://localhost:${PORT}`);
      console.log(`📡 Accesible en red:    http://192.168.18.3:${PORT}`);
      console.log(`⚡ WebSockets:         ACTIVOS (Puerto compartido)`);
    });

  } catch (error) {
    console.error("❌ Error fatal al iniciar el servidor:", error);
  }
};

startServer();
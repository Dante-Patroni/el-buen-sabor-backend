const express = require('express');
const path = require('path');
const cors = require('cors');
const { dbConnection } = require('./src/config/mongo'); 
const { sequelize } = require('./src/models'); // 🆕 1. Importamos la conexión SQL
const setupListeners = require('./src/listeners/setupListeners');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🆕 HACER PÚBLICA LA CARPETA UPLOADS
// Esto permite acceder a http://localhost:3000/uploads/foto.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Documentación Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/docs/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Inicializaciones
const startServer = async () => {
    try {
        // 1. Conectar Mongo
        await dbConnection();
        
        // 2. Sincronizar MySQL (🆕 La Magia: Crea tablas si no existen)
        await sequelize.sync({ force: false }); 
        console.log('📦 Tablas MySQL sincronizadas');

        // 3. Activar Listeners
        setupListeners();

        // 4. Arrancar Servidor
        app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor 'El Buen Sabor' corriendo.`);
    console.log(`📡 Accesible localmente en: http://localhost:${PORT}`);
    console.log(`📡 Accesible en red (Celular): http://<TU_IP_PC>:${PORT}`); // Ej: 192.168.1.37
    console.log(`📄 Documentación: http://localhost:${PORT}/api-docs`);
});
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
    }
};

startServer(); // Ejecutamos la función de inicio

// Rutas
app.use('/api/pedidos', require('./src/routes/pedidoRoutes'));
app.use('/api/platos', require('./src/routes/platoRoutes'));
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./src/config/mongo'); 
const { sequelize } = require('./src/models'); // 🆕 1. Importamos la conexión SQL
const setupListeners = require('./src/listeners/setupListeners');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
        app.listen(PORT, () => {
            console.log(`🚀 Servidor 'El Buen Sabor' corriendo en http://localhost:${PORT}`);
            console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
    }
};

startServer(); // Ejecutamos la función de inicio

// Rutas
app.use('/api/pedidos', require('./src/routes/pedidoRoutes'));
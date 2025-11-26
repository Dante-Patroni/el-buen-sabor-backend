const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./src/config/mongo');
const setupListeners = require('./src/listeners/setupListeners'); // 🆕 1. Importar
const pedidoRoutes = require('./src/routes/pedidoRoutes'); // Importar rutas

// 🆕 Importamos Swagger UI y nuestra configuración
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000; // 🆕 Usamos la variable de entorno o 3000 por defecto
app.use(cors());
app.use(express.json()); // ¡Vital para recibir JSON!

// 🆕 Conectamos a Base de Datos
dbConnection();
setupListeners(); // 🆕 2. Activar los oídos

// 🆕 RUTA DE DOCUMENTACIÓN (Accesible en /api-docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas de la API
app.use('/api/pedidos', pedidoRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor 'El Buen Sabor' corriendo en http://localhost:${PORT}`);
    // 🆕 Aviso extra en consola
    console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);
});
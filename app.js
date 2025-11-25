const express = require('express');
const cors = require('cors');
const pedidoRoutes = require('./src/routes/pedidoRoutes'); // Importar rutas

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // ¡Vital para recibir JSON!

// Usar las rutas
app.use('/api/pedidos', pedidoRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor 'El Buen Sabor' corriendo en http://localhost:${PORT}`);
});
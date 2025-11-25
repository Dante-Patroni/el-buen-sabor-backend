const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/pedidoController');

// RUTA: POST http://localhost:3000/api/pedidos
// Descripción: Crea un nuevo pedido validando stock
router.post('/', (req, res) => PedidoController.crear(req, res));

module.exports = router;
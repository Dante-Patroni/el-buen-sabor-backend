const express = require("express");
const router = express.Router();

const mesaController = require("../controllers/mesaController");

// Importamos el controlador (que crearemos en el paso 2)
// Nota: Aún no existe el archivo, pero ya lo dejamos listo.
const MesaController = require("../controllers/mesaController");
const mesaController = new MesaController();
/**
 * @swagger
 * tags:
 *   name: Mesas
 *   description: Gestión de estados de mesas en tiempo real
 */

/**
 * @swagger
 * /api/mesas:
 *   get:
 *     summary: Obtiene el estado actual de todas las mesas
 *     description: Calcula si las mesas están ocupadas basándose en pedidos pendientes y suma el total gastado.
 *     tags: [Mesas]
 *     responses:
 *       200:
 *         description: Lista de mesas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   nombre:
 *                     type: string
 *                     example: "Mesa 4"
 *                   estado:
 *                     type: string
 *                     enum: [libre, ocupada]
 *                     description: '"ocupada" si hay pedidos pendientes, sino "libre"'
 *                     example: "ocupada"
 *                   totalActual:
 *                     type: number
 *                     description: Suma del precio de los platos pendientes
 *                     example: 1200.50
 *                   itemsPendientes:
 *                     type: integer
 *                     description: Cantidad de platos sin entregar/pagar
 *                     example: 3
 *                   fechaApertura:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha del pedido más antiguo pendiente
 *                     example: "2025-12-04T13:53:14.000Z"
 *       500:
 *         description: Error al calcular el estado de las mesas
 */

// Definimos la ruta GET raíz (/)
// Esto responderá cuando alguien llame a: http://localhost:3000/api/mesas
router.get("/", (req, res) => mesaController.obtenerEstadoMesas(req, res));

/**
 * @swagger
 * /api/mesas/{id}/cierre:
 *   post:
 *     summary: Cierra la mesa y marca todos sus pedidos activos como 'pagado'
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Número o ID de la mesa a cerrar
 *     responses:
 *       200:
 *         description: Mesa cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mesa 4 cerrada correctamente"
 *                 pedidosActualizados:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Error al cerrar la mesa
 */
// Endpoint para Cerrar Mesa (Liberar)
router.post('/:id/cierre', mesaController.cerrarMesa.bind(mesaController));

module.exports = router;

const express = require("express");
const router = express.Router();

const mesaController = require("../controllers/mesaController");

// Importamos el controlador (que crearemos en el paso 2)
// Nota: Aún no existe el archivo, pero ya lo dejamos listo.
const MesaController = require("../controllers/mesaController");
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
 *                     example: "ocupada"
 *                   totalActual:
 *                     type: number
 *                     description: Total acumulado en la mesa
 *                     example: 1500.00
 *       500:
 *         description: Error al obtener las mesas
 */

// Definimos la ruta GET raíz (/)
// Esto responderá cuando alguien llame a: http://localhost:3000/api/mesas
router.get("/", mesaController.listar);
/**
 * @swagger
 * /api/mesas/{id}/cerrar:
 *   post:
 *     summary: Cierra la mesa y libera al mozo
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número o ID de la mesa a cerrar
 *     responses:
 *       200:
 *         description: Mesa cerrada exitosamente
 *       500:
 *         description: Error al cerrar la mesa
 */
// Endpoint para Cerrar Mesa (Liberar)
router.post("/:id/cerrar", mesaController.cerrarMesa);

module.exports = router;

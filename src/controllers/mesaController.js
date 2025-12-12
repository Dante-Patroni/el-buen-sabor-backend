// 👇 Importamos la instancia directa
const mesaService = require("../services/mesaService");

class MesaController {
  
  // 1. LISTAR / OBTENER ESTADO
  async listar(req, res) {
    try {
      const mesas = await mesaService.listar();

      // 🕵️‍♂️ EL ESPÍA DE DEBUG (Aquí veremos si totalActual viaja o no)
      console.log("\n🔍 [DEBUG CONTROLLER] Revisando Mesa 4:");
      const mesa4 = mesas.find(m => m.id == 4 || m.numero == '4');
      if (mesa4) {
          console.log(` - ID: ${mesa4.id}`);
          console.log(` - Estado: ${mesa4.estado}`);
          console.log(` - TotalActual: ${mesa4.totalActual} (Tipo: ${typeof mesa4.totalActual})`);
          console.log(` - Objeto completo: ${JSON.stringify(mesa4)}`);
      } else {
          console.log("⚠️ La Mesa 4 NO aparece en la lista.");
      }
      console.log("--------------------------------------------------\n");

      res.status(200).json(mesas);
    } catch (error) {
      console.error("Error al obtener mesas:", error.message);
      res.status(500).json({ mensaje: "Error al obtener el estado de las mesas" });
    }
  }

  // 2. CERRAR MESA
  async cerrarMesa(req, res) {
    try {
      const { id } = req.params;
      const resultado = await mesaService.cerrarMesa(id);

      res.status(200).json({
           mensaje: `Mesa ${id} cerrada correctamente`,
           pedidosActualizados: resultado
      });
    } catch (error) {
      console.error(`Error al cerrar la mesa ${req.params.id}:`, error);
      res.status(500).json({ error: "No se pudo cerrar la mesa" });
    }
  }
}

module.exports = new MesaController();
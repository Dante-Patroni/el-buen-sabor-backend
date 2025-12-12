// Importamos la instancia del servicio
const mesaService = require("../services/mesaService");

class MesaController {
  
  // 1. LISTAR
  async listar(req, res) {
    console.log("👉 [Controller] Entrando a listar mesas..."); // LOG 1

    try {
      if (!mesaService) throw new Error("El servicio de mesas es undefined");

      const mesas = await mesaService.listar();

      console.log(`✅ [Controller] Se encontraron ${mesas.length} mesas.`); // LOG 2
      
      // LOG DE DEBUG PARA EL TEST
      const mesa4 = mesas.find(m => m.id == 4 || m.numero == '4');
      if (mesa4) {
          console.log("🔍 [DEBUG] Mesa 4:", JSON.stringify(mesa4));
      }

      res.status(200).json(mesas);

    } catch (error) {
      console.error("❌ [Controller] Error FATAL en listar:", error); // LOG DE ERROR
      res.status(500).json({ error: error.message });
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
      console.error(`❌ Error al cerrar mesa ${req.params.id}:`, error);
      res.status(500).json({ error: "No se pudo cerrar la mesa" });
    }
  }
}

// 👇 EXPORTAMOS LA INSTANCIA (IMPORTANTE)
module.exports = new MesaController();
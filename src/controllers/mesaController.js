const mesaService = require("../services/mesaService");

const listar = async (req, res) => {
  console.log("👉 [Controller] Petición recibida en listar mesas.");
  
  try {
    const mesas = await mesaService.listar();

    // DEBUG: Verificamos qué estamos por enviar
    const mesa4 = mesas.find(m => m.id == 4 || m.numero == '4');
    if (mesa4) {
        console.log(`✅ [Controller] Mesa 4 encontrada. Estado: ${mesa4.estado}, Total: ${mesa4.totalActual}`);
    } else {
        console.warn("⚠️ [Controller] La Mesa 4 no aparece en la lista.");
    }

    res.status(200).json(mesas);
  } catch (error) {
    console.error("❌ [Controller] Error FATAL:", error);
    res.status(500).json({ error: error.message });
  }
};

const cerrarMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await mesaService.cerrarMesa(id);

    res.status(200).json({
         mensaje: `Mesa ${id} cerrada correctamente`,
         pedidosActualizados: resultado
    });
  } catch (error) {
    console.error(`❌ Error al cerrar mesa:`, error);
    res.status(500).json({ error: "No se pudo cerrar la mesa" });
  }
};

module.exports = {
  listar,
  cerrarMesa
};
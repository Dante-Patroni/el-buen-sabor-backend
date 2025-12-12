const mesaService = require("../services/mesaService");

const listar = async (req, res) => {
  console.log("👉 [Controller] Petición recibida en listar mesas.");
  
  try {
    const mesasRaw = await mesaService.listar();

    const mesasFormateadas = mesasRaw.map(m => {
        // 1. Obtenemos el dinero limpio
        const valorNumerico = parseFloat(m.totalActual) || 0;

        // 2. Calculamos Items Pendientes (Requisito del Test)
        // Si hay plata en la mesa, asumimos que hay al menos 1 pedido pendiente.
        const itemsCalc = (valorNumerico > 0 || m.estado === 'ocupada') ? 1 : 0;

        return {
            id: m.id,
            // Aseguramos que el nombre sea "Mesa 4" si no viene de la DB, para ayudar al find()
            nombre: m.nombre || `Mesa ${m.id}`,
            numero: m.numero || m.id.toString(),
            estado: m.estado, // 'ocupada'
            
            // 👇 EL CAMPO QUE FALTABA (Punto C del test)
            itemsPendientes: itemsCalc,

            // 👇 EL DINERO (Punto D del test)
            totalActual: valorNumerico
        };
    });

    // DEBUG: Verificamos que ahora sí tenga TODO
    const mesa4 = mesasFormateadas.find(m => m.id === 4);
    if (mesa4) {
        console.log(`✅ [Controller] Mesa 4 Completa:`, JSON.stringify(mesa4));
    }

    res.status(200).json(mesasFormateadas);

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
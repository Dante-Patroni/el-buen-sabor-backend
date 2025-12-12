const mesaService = require("../services/mesaService");

const listar = async (req, res) => {
  console.log("👉 [Controller] Petición recibida en listar mesas.");
  
  try {
    const mesasRaw = await mesaService.listar();

    // 👇 EL FIX MAESTRO:
    // Transformamos los datos manualmente antes de enviarlos.
    // 1. Aseguramos que 'totalActual' sea un NÚMERO (parseFloat).
    // 2. Aseguramos que las claves sean exactamente las que espera el test.
    const mesasFormateadas = mesasRaw.map(m => ({
        id: m.id,
        // Si numero no existe, usamos el id como string
        numero: m.numero || m.id.toString(), 
        estado: m.estado, // 'ocupada'
        // Convertimos "1500.00" (String) a 1500 (Number) para que el test no llore
        totalActual: parseFloat(m.totalActual) || 0 
    }));

    // DEBUG: Verificamos el formato final
    const mesa4 = mesasFormateadas.find(m => m.id === 4);
    if (mesa4) {
        console.log(`✅ [Controller] Enviando Mesa 4:`, JSON.stringify(mesa4));
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
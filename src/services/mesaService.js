const { Mesa, Pedido, Sequelize } = require("../models");
const { Op } = Sequelize;

// Función simple, sin 'class'
const listar = async () => {
  console.log("🛠 [Service] Consultando base de datos...");
  
  // Verificación de seguridad
  if (!Mesa) throw new Error("El modelo Mesa no está cargado.");

  // Buscamos las mesas (traerá totalActual porque está en la BD)
  const mesas = await Mesa.findAll({
    order: [['id', 'ASC']]
  });

  return mesas;
};

const cerrarMesa = async (mesaId) => {
  // A. Liberar Mesa
  await Mesa.update({
    estado: 'libre', 
    totalActual: 0.00,
    mozoId: null 
  }, {
    where: { id: mesaId }
  });

  // B. Actualizar Pedidos
  const [actualizados] = await Pedido.update(
    { estado: 'pagado' }, 
    {
      where: {
        mesa: mesaId, 
        estado: { [Op.notIn]: ['pagado', 'rechazado'] }
      }
    }
  );
  
  return actualizados;
};

// Exportamos el objeto directo
module.exports = {
  listar,
  cerrarMesa
};
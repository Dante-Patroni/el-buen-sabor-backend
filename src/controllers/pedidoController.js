class PedidoController {

  // 👇 INYECCIÓN DE DEPENDENCIA CORRECTA
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  } // <--- ¡Faltaba cerrar esta llave!

  // ---------------------------------------------------------
  // 1. CREAR (POST)
  // ---------------------------------------------------------
  crear = async (req, res) => {
    try {
      const { cliente, platoId, mesa } = req.body;

      // Validación básica (el middleware lo hace, pero esto es doble seguridad)
      if (!platoId || !mesa) {
        return res.status(400).json({ error: "Faltan datos obligatorios (mesa o platoId)." });
      }

      // Asegurar formatos
      const mesaString = String(mesa);
      const clienteFinal = cliente || "Anónimo";

      // 👇 CORRECCIÓN CLAVE:
      // 1. Usamos 'this.pedidoService'.
      // 2. Enviamos un OBJETO, porque así lo definimos en el Servicio.
      const pedidoCreado = await this.pedidoService.crearYValidarPedido({
        mesa: mesaString,
        platoId: platoId,
        cliente: clienteFinal
      });

      res.status(201).json({
        mensaje: "Pedido creado exitosamente 👨‍🍳",
        data: pedidoCreado
      });

    } catch (error) {
      console.error("Error Crear:", error.message);

      // Manejo de errores de negocio
      if (error.message === "STOCK_INSUFICIENTE") return res.status(409).json({ error: "No hay stock suficiente para este plato." });
      if (error.message.includes("Plato no encontrado")) return res.status(404).json({ error: "El plato solicitado no existe." });

      return res.status(500).json({ error: "Error interno al procesar el pedido." });
    }
  }

  // ---------------------------------------------------------
  // 2. LISTAR (GET)
  // ---------------------------------------------------------
  // 👇 Convertido a Arrow Function para asegurar el 'this'
  listar = async (req, res) => {
    try {
      // Usamos el método estandarizado 'obtenerTodos' del servicio
      const pedidos = await this.pedidoService.obtenerTodos();
      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error Listar:", error.message);
      res.status(500).json({ error: "Error al obtener pedidos" });
    }
  }

  // ---------------------------------------------------------
  // 3. HISTORIAL DE MESA
  // ---------------------------------------------------------
  buscarPorMesa = async (req, res) => {
    try {
      const { mesa } = req.params;

      if (!mesa) {
        return res.status(400).json({ error: "Número de mesa es obligatorio" });
      }

      // ⚠️ Nota: Asegúrate de agregar 'buscarPedidosPorMesa' en tu Service si no existe aún.
      // Si usas el findAll con filtro, sería algo como: this.pedidoService.listar({ where: { mesa } })
      // Por ahora asumo que agregarás el método en el servicio:
      const pedidos = await this.pedidoService.buscarPedidosPorMesa(mesa);

      res.status(200).json(pedidos);
    } catch (error) {
      console.error(`Error buscando pedidos por mesa ${req.params.mesa}:`, error);
      res.status(500).json({ error: "Error al obtener el historial de la mesa" });
    }
  }

  // ---------------------------------------------------------
  // 4. ELIMINAR (DELETE)
  // ---------------------------------------------------------
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      // 👇 Usamos 'this.pedidoService'
      await this.pedidoService.eliminarPedido(id);

      res.status(200).json({
        mensaje: "Pedido eliminado y stock restaurado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar:", error.message);

      if (error.message === "PEDIDO_NO_ENCONTRADO") {
        return res.status(404).json({ error: "El pedido no existe" });
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = PedidoController;
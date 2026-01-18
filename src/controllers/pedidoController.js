class PedidoController {

  // 👇 INYECCIÓN DE DEPENDENCIA CORRECTA
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  } // <--- ¡Faltaba cerrar esta llave!

  // ---------------------------------------------------------
  // CREAR (POST)
  // ---------------------------------------------------------
  crear = async (req, res) => {
    try {
      // 1. Ya NO validamos manualmente aquí si falta mesa o platoId.
      // El middleware 'validarPedido' ya hizo ese trabajo sucio antes de entrar aquí.

      const pedido = await this.pedidoService.crearYValidarPedido(req.body);

      res.status(201).json({
        message: "Pedido creado con éxito",
        data: pedido
      });
    } catch (error) {
      console.error("Error Crear:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ---------------------------------------------------------
  // MODIFICAR (PUT)
  // ---------------------------------------------------------
  modificar = async (req, res) => {
    try {

      const pedido = await this.pedidoService.modificarPedido(req.body);

      res.status(201).json({
        message: "Pedido modificado con éxito",
        data: pedido
      });
    } catch (error) {
      console.error("Error modificar:", error.message);
      res.status(500).json({ error: error.message });
    }

  }
  // ---------------------------------------------------------
  // 2. LISTAR (GET)
  // ---------------------------------------------------------
  // 👇 Convertido a Arrow Function para asegurar el 'this'
  listar = async (req, res) => {
    try {
      // Usamos el método estandarizado 'obtenerTodos' del servicio
      const pedidos = await this.pedidoService.listarPedidos();
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
  // 3.5 CERRAR MESA (POST)
  // ---------------------------------------------------------
  cerrarMesa = async (req, res) => {
    try {
      const { mesaId } = req.body;

      if (!mesaId) {
        return res.status(400).json({ error: "Falta el ID de la mesa (mesaId)" });
      }

      const resultado = await this.pedidoService.cerrarMesa(mesaId);

      res.status(200).json({
        mensaje: "Mesa cerrada y cobrada exitosamente",
        ...resultado
      });

    } catch (error) {
      console.error("Error Cerrar Mesa:", error.message);
      res.status(500).json({ error: "No se pudo cerrar la mesa" });
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
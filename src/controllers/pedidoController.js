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
      // Filtro opcional por query string ?estado=pendiente
      //Me permite filtrar los pedidos por su estado si se proporciona en la consulta
      const { estado } = req.query;

      // Usamos el método estandarizado 'obtenerTodos' del servicio
      const pedidos = await this.pedidoService.listarPedidos();

      //Devuelve la cantidad total de pedidos y los datos en formato JSON
      res.status(200).json({
        cantidad: pedidos.length,
        data: pedidos
      });

    } catch (error) {
      console.error("Error Listar:", error.message);
      res.status(500).json({ error: "Error al obtener pedidos" });
    }
  }

  // ---------------------------------------------------------
  // 3. HISTORIAL DE MESA
  // ---------------------------------------------------------
  //Devuelve los pedidos asociados a una mesa específica
  //No crea ni modifica nada, solo consulta
  //Es GET + lectura pura

  buscarPorMesa = async (req, res) => {
    try {
      //Viene de GET /api/pedidos/mesa/:mesa
      const { mesa } = req.params;

      // La validación se realiza en el middleware
      const pedidos = await this.pedidoService.buscarPedidosPorMesa(mesa);
      // Siempre responde 200 con array (vacío o con datos)
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

      const resultado = await this.pedidoService.cerrarMesa(mesaId);

      res.status(200).json({
        mensaje: "Mesa cerrada y cobrada exitosamente",
        ...resultado
      });

    } catch (error) {
      console.error("Error Cerrar Mesa:", error.message);

      res.status(error.status || 500).json({
        error: error.message
      });
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
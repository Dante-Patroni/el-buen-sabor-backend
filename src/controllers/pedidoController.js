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

  // ---------------------------------------------------------
  // 4. CERRAR MESA
  // ---------------------------------------------------------
  cerrarMesa = async (req, res) => {
    try {
      console.log("------------------------------------------------");
      console.log("🛑 DEBUG: INICIANDO CERRAR MESA");
      console.log("📥 Headers:", req.headers['content-type']); // ¿Dice application/json?
      console.log("📦 Body Completo (req.body):", req.body);     // ¿Llega vacío {} o undefined?
      console.log("🔗 Params (req.params):", req.params);       // ¿Viene algo en la URL?
      console.log("------------------------------------------------");

      // Intentamos leer mesaId
      const { mesaId } = req.body;
      console.log("🧐 mesaId extraído:", mesaId);

      // Validación con Log de error
      if (!mesaId) {
        console.error("❌ ERROR: mesaId es undefined o null");
        // Si req.body está vacío, quizás falta el middleware de express.json()
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error("⚠️ ALERTA: req.body está vacío. Revisa si enviaste JSON en Postman o si falta app.use(express.json()) en tu server.");
        }
        return res.status(400).json({ error: "Número de mesa es obligatorio" });
      }

      const resultado = await this.pedidoService.cerrarMesa(mesaId);

      console.log("✅ ÉXITO: Mesa cerrada. Resultado:", resultado);
      res.status(200).json(resultado);

    } catch (error) {
      console.error("🔥 EXCEPCIÓN en cerrarMesa:", error.message);
      
      if (error.message === 'Mesa no encontrada') return res.status(404).json({ error: error.message });
      if (error.message.includes('consumos pendientes')) return res.status(400).json({ error: error.message });
      
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
module.exports = PedidoController;
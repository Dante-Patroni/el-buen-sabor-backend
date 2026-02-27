const pedidoEmitter = require("../events/pedidoEvents");

// 👇 1. CAMBIO AQUÍ: Agregamos (io) para recibir el megáfono
/**
 * @description Registra listeners de eventos de pedido y notifica por consola/WebSocket.
 * @param {import("socket.io").Server|undefined} io - Instancia opcional de Socket.IO.
 * @returns {void} Inicializa listeners globales sobre `pedidoEmitter`.
 */
const setupListeners = (io) => {
  
  // 👂 OÍDO 1: LA COCINA (Simulación de impresión + Pantalla Web)
  /**
   * @description Procesa evento de pedido creado para cocina y monitor en tiempo real.
   * @param {{pedido: object}} payload - Evento emitido con pedido serializado.
   * @returns {void} Solo efectos laterales.
   */
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("----------------------------------------------------");
    console.log(`👨‍🍳 COCINA: ¡Nuevo pedido recibido! (#${pedido.id})`);
    console.log(`🥘 Plato ID: ${pedido.platoId} | Cliente: ${pedido.cliente}`);
    console.log("🔥 Empezando a cocinar... (Esto corre en paralelo)");

    // 👇 2. CAMBIO AQUÍ: ¡Gritamos al Monitor Web!
    if (io) {
        console.log("📡 SOCKET: Enviando datos a la pantalla de cocina...");
        io.emit('nuevo-pedido', pedido);
    } else {
        console.warn("⚠️ Advertencia: WebSocket no inicializado en listeners.");
    }
    
    console.log("----------------------------------------------------");
  });

  // 👂 OÍDO 2: FACTURACIÓN ELECTRÓNICA (Simulación de proceso externo lento)
  /**
   * @description Simula integracion asincronica de facturacion para un pedido creado.
   * @param {{pedido: object}} payload - Evento emitido con pedido serializado.
   * @returns {void} Solo efectos laterales.
   */
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log(
      `🧾 FACTURACIÓN: Iniciando conexión con servidor de Impuestos (AFIP)...`,
    );

    // Simulamos que el servicio de impuestos es lento (3 segundos)
    /**
     * @description Simula respuesta diferida de servicio externo de facturacion.
     * @returns {void} Solo logging.
     */
    setTimeout(() => {
      // Aquí iría la llamada real a la API externa
      const cae = "732647236472"; // Código de Autorización Electrónico simulado
      console.log(
        `✅ FACTURACIÓN: Factura autorizada para Cliente: ${pedido.cliente}. CAE: ${cae}`,
      );
      console.log(`🖨️ IMPRIMIENDO TICKET FISCAL...`);
    }, 3000);
  });

  console.log("👂 Sistema de Eventos: LISTENERS ACTIVADOS (Con WebSockets)");
};

module.exports = setupListeners;

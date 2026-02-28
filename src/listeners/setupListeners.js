const pedidoEmitter = require("../events/pedidoEvents");

/**
 * @description Registra listeners de eventos de pedidos y facturacion para notificaciones en consola y WebSocket.
 * @param {import("socket.io").Server|undefined} io - Instancia opcional de Socket.IO.
 * @returns {void} Inicializa listeners globales sobre `pedidoEmitter`.
 */
const setupListeners = (io) => {
  /**
   * @description Procesa evento de pedido creado para monitor de cocina.
   * @param {{pedido: object}} payload - Evento emitido con el pedido serializado.
   * @returns {void} Solo efectos laterales.
   */
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("----------------------------------------------------");
    console.log(`COCINA: Nuevo pedido recibido (#${pedido.id})`);
    console.log(`Mesa: ${pedido.mesa || "N/D"} | Cliente: ${pedido.cliente || "N/D"}`);

    if (io) {
      console.log("SOCKET: Enviando datos a la pantalla de cocina...");
      io.emit("nuevo-pedido", pedido);
    } else {
      console.warn("Advertencia: WebSocket no inicializado en listeners.");
    }

    console.log("----------------------------------------------------");
  });

  /**
   * @description Simula proceso asincronico externo de facturacion para un pedido creado.
   * @param {{pedido: object}} payload - Evento emitido con el pedido serializado.
   * @returns {void} Solo efectos laterales.
   */
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("FACTURACION: Iniciando proceso externo simulado...");

    /**
     * @description Simula la respuesta tardia de un proveedor externo.
     * @returns {void} Solo logging.
     */
    setTimeout(() => {
      const cae = "732647236472";
      console.log(
        `FACTURACION: Pedido #${pedido.id} autorizado. CAE simulado: ${cae}`
      );
    }, 3000);
  });

  /**
   * @description Publica tickets de cierre de mesa para monitor de caja.
   * @param {object} ticket - Resumen de facturacion generado al cerrar mesa.
   * @returns {void} Solo efectos laterales.
   */
  pedidoEmitter.on("ticket-generado", (ticket) => {
    console.log("----------------------------------------------------");
    console.log(`CAJA: Ticket generado para mesa ${ticket.mesaId}`);

    if (io) {
      console.log("SOCKET: Enviando ticket a la pantalla de caja...");
      io.emit("ticket-generado", ticket);
    } else {
      console.warn("Advertencia: WebSocket no inicializado para ticket-generado.");
    }

    console.log("----------------------------------------------------");
  });

  console.log("Sistema de eventos: listeners activados (WebSockets)");
};

module.exports = setupListeners;

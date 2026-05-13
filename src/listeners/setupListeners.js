const pedidoEmitter = require("../events/pedidoEvents");
const jwt = require("jsonwebtoken");  

// Definir la clave secreta (debería venir de tus variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @description Registra listeners de eventos y protege la conexión con JWT.
 * @param {import("socket.io").Server|undefined} io - Instancia opcional de Socket.IO.
 */
const setupListeners = (io) => {
  
  // --- MIDDLEWARE DE AUTENTICACIÓN ---
  if (io) {
    io.use((socket, next) => {
      // Extraemos el token del handshake (enviado desde el cliente)
      const token = socket.handshake.auth.token;

      if (!token) {
        console.error("SOCKET: Intento de conexión sin token.");
        return next(new Error("NO_AUTH"));
      }

      try {
        // Verificamos el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Adjuntamos los datos del usuario al socket para uso futuro
        socket.usuario = decoded;
        
        console.log(`SOCKET: Usuario ${decoded.id || 'desconocido'} autenticado exitosamente.`);
        next();
      } catch (error) {
        console.error("SOCKET: Token inválido o expirado.");
        next(new Error("TOKEN_INVALIDO"));
      }
    });
  }

  /**
   * @description Procesa evento de pedido creado para monitor de cocina.
   */
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("----------------------------------------------------");
    console.log(`COCINA: Nuevo pedido recibido (#${pedido.id})`);

    if (io) {
      console.log("SOCKET: Enviando datos a la pantalla de cocina...");
      io.emit("nuevo-pedido", pedido);
    } else {
      console.warn("Advertencia: WebSocket no inicializado en listeners.");
    }
    console.log("----------------------------------------------------");
  });

  /**
   * @description Simula proceso asincronico externo de facturacion.
   */
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("FACTURACION: Iniciando proceso externo simulado...");
    setTimeout(() => {
      const cae = "732647236472";
      console.log(`FACTURACION: Pedido #${pedido.id} autorizado. CAE: ${cae}`);
    }, 3000);
  });

  /**
   * @description Publica tickets de cierre de mesa para monitor de caja.
   */
  pedidoEmitter.on("ticket-generado", (ticket) => {
    console.log("----------------------------------------------------");
    console.log(`CAJA: Ticket generado para mesa ${ticket.mesaId}`);

    if (io) {
      console.log("SOCKET: Enviando ticket a la pantalla de caja...");
      io.emit("ticket-generado", ticket);
    }
    console.log("----------------------------------------------------");
  });

  console.log("Sistema de eventos: listeners activados y protegidos con JWT");
};

module.exports = setupListeners;
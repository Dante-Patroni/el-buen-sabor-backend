const pedidoEmitter = require("../events/pedidoEvents");

const setupListeners = () => {
  // 👂 OÍDO 1: LA COCINA (Simulación de impresión de comanda)
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("----------------------------------------------------");
    console.log(`👨‍🍳 COCINA: ¡Nuevo pedido recibido! (#${pedido.id})`);
    console.log(`🥘 Plato ID: ${pedido.platoId} | Cliente: ${pedido.cliente}`);
    console.log("🔥 Empezando a cocinar... (Esto corre en paralelo)");
    console.log("----------------------------------------------------");
  });

  // 👂 OÍDO 2: FACTURACIÓN ELECTRÓNICA (Simulación de proceso externo lento)
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log(
      `🧾 FACTURACIÓN: Iniciando conexión con servidor de Impuestos (AFIP)...`,
    );

    // Simulamos que el servicio de impuestos es lento (3 segundos)
    setTimeout(() => {
      // Aquí iría la llamada real a la API externa
      const cae = "732647236472"; // Código de Autorización Electrónico simulado
      console.log(
        `✅ FACTURACIÓN: Factura autorizada para Cliente: ${pedido.cliente}. CAE: ${cae}`,
      );
      console.log(`🖨️ IMPRIMIENDO TICKET FISCAL...`);
    }, 3000);
  });

  console.log("👂 Sistema de Eventos: LISTENERS ACTIVADOS");
};

module.exports = setupListeners;

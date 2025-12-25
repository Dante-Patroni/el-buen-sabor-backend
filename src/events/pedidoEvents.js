const pedidoEmitter = require("./pedidoEmitter"); // Importamos tu Singleton

const setupListeners = () => {
  
  // 🟢 CANAL 1: COCINA (Se activa al CREAR pedido)
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log(`👨‍🍳 COCINA: Marchando pedido #${pedido.id} para ${pedido.cliente}`);
    // Aquí la lógica de cocina...
  });

  // 🔴 CANAL 2: FACTURACIÓN (Se activa al CERRAR mesa)
  // ¡Este es el cambio clave! Ya no escucha "pedido-creado", escucha "mesa-cerrada"
  pedidoEmitter.on("mesa-cerrada", ({ mesaId, total }) => {
    console.log(`🧾 FACTURACIÓN: Conectando a AFIP para Mesa ${mesaId}...`);
    
    setTimeout(() => {
       console.log(`✅ FACTURADO: Total $${total} - CAE Autorizado.`);
    }, 3000);
  });

};

module.exports = setupListeners;
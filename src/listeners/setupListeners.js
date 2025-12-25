const pedidoEmitter = require("../events/pedidoEvents");

// Si usas WebSockets en el futuro, los importarías aquí
// const io = require('../app').io; 

const setupListeners = () => {
  
  // 👂 OÍDO 1: LA COCINA (Esto está PERFECTO, se queda igual)
  // Se dispara cuando el mozo envía la comanda
  pedidoEmitter.on("pedido-creado", ({ pedido }) => {
    console.log("----------------------------------------------------");
    console.log(`👨‍🍳 COCINA: ¡Nuevo pedido recibido! (#${pedido.id})`);
    console.log(`🥘 Plato ID: ${pedido.platoId} | Cliente: ${pedido.cliente}`);
    console.log("🔥 Empezando a cocinar...");
    console.log("----------------------------------------------------");
    
    // FUTURO: io.emit('cocina-nuevo-pedido', pedido);
  });

  // 👂 OÍDO 2: SOLICITUD DE CUENTA (Nuevo: El Mozo avisa a la Caja)
  // Se dispara cuando el mozo aprieta el botón rojo, pero SOLO para avisar
  pedidoEmitter.on("solicitar-cuenta", ({ mesaId, mozo }) => {
    console.log("----------------------------------------------------");
    console.log(`🛎️ ALERTA CAJA: La Mesa ${mesaId} pidió la cuenta.`);
    console.log(`💁‍♂️ Mozo: ${mozo}`);
    console.log("⏳ Esperando que el Cajero verifique y cobre...");
    console.log("----------------------------------------------------");

    // FUTURO: io.emit('caja-alerta-cuenta', { mesaId, mozo });
  });

  // 👂 OÍDO 3: FACTURACIÓN REAL (Se movió al final)
  // Se dispara SOLO cuando la Caja (o el mozo) confirma el cobro real
  pedidoEmitter.on("mesa-cerrada", ({ mesaId, total, cliente }) => {
    console.log(
      `🧾 FACTURACIÓN: Iniciando conexión con servidor de Impuestos (AFIP)...`
    );

    // Simulamos latencia de AFIP
    setTimeout(() => {
      const cae = "732647236472"; // CAE Simulado
      console.log("----------------------------------------------------");
      console.log(`✅ AFIP APROBÓ EL PAGO`);
      console.log(`💰 Total Facturado: $${total}`);
      console.log(`👤 Cliente: ${cliente}`);
      console.log(`🔑 CAE: ${cae}`);
      console.log(`🖨️ IMPRIMIENDO TICKET FISCAL FINAL...`);
      console.log("----------------------------------------------------");
      
      // Aquí podrías enviar el PDF por email
    }, 3000);
  });

  console.log("👂 Sistema de Eventos: LISTENERS ACTIVADOS Y SEPARADOS");
};

module.exports = setupListeners;
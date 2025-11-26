const EventEmitter = require('events');

// Creamos nuestra propia clase de eventos heredando de Node.js
class PedidoEmitter extends EventEmitter {}

// Instanciamos el objeto. Al exportar "new", aseguramos que todo el sistema use LA MISMA instancia.
const pedidoEmitter = new PedidoEmitter();

module.exports = pedidoEmitter;
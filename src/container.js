const PedidoService = require("./services/pedidoService");
const MesaService   = require("./services/mesaService");
const PlatoService  = require("./services/platoService");
const SequelizePedidoRepository = require("./repositories/sequelize/sequelizePedidoRepository");
const SequelizeMesaRepository   = require("./repositories/sequelize/sequelizeMesaRepository");
const SequelizePlatoRepository  = require("./repositories/sequelize/sequelizePlatoRepository");
const pedidoEmitter = require("./events/pedidoEvents");

const pedidoRepository = new SequelizePedidoRepository();
const mesaRepository   = new SequelizeMesaRepository();
const platoRepository  = new SequelizePlatoRepository();

const platoService  = new PlatoService(platoRepository);
const mesaService   = new MesaService(mesaRepository, pedidoRepository);
const pedidoService = new PedidoService(
  pedidoRepository,
  platoService,
  mesaService,
  pedidoEmitter
);

module.exports = { pedidoService, mesaService, platoService };
const { Pedido, Plato } = require('../../models'); // Tus modelos Sequelize
const StockAdapter = require('./stockAdapter');    // Tu Adapter recién creado

class PedidoService {

    async crearYValidarPedido(cliente, platoId) {
        // 1. Buscar el Plato para saber su ingrediente principal
        const plato = await Plato.findByPk(platoId);
        
        if (!plato) {
            throw new Error('PLATO_NO_ENCONTRADO'); // Sale automáticamente y Manejaremos esto en el Controller
        }

        // 2. Consultar Stock vía Adapter (Patrón Adapter en acción)
        const stockDisponible = await StockAdapter.consultarStock(plato.ingredientePrincipal);

        console.log(`Debug: Plato ${plato.nombre} requiere ${plato.ingredientePrincipal}. Stock: ${stockDisponible}`);

        // 3. Regla de Negocio: Validar disponibilidad
        // (Asumimos que cada plato consume 1 unidad de ingrediente para simplificar)
        if (stockDisponible < 1) {
            throw new Error('STOCK_INSUFICIENTE');// Sale automáticamente y Manejaremos esto en el Controller
        }

        // 4. Si todo está OK, persistir en MySQL
        const nuevoPedido = await Pedido.create({//Acá se crea el pedido en la base de datos con Sequelize
            cliente,
            PlatoId: platoId,
            fecha: new Date(),
            estado: 'en_preparacion' // Estado inicial feliz
        });

        return nuevoPedido; // Retornamos el pedido creado
    }
}

module.exports = new PedidoService();
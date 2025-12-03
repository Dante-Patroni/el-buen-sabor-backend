/* Este es el Corazón de la Lógica de Negocio (Business Logic Layer). 
A diferencia de los Controladores (que solo reciben y responden) o los
 Modelos (que solo guardan datos), el Servicio es el que Piensa y 
 Toma Decisiones.*/ 
const { Pedido } = require('../models'); 

class PedidoService {

    // 1. Recibimos el adaptador en el constructor (Inyección de Dependencias)
    constructor(stockAdapter) {
        this.stockAdapter = stockAdapter;
    }

    // LÓGICA: CREAR PEDIDO
    async crearYValidarPedido(cliente, platoId, mesa ) {
        // Validación adicional en el servicio
    if (!mesa || mesa.toString().trim() === "") {
        throw new Error('MESA_REQUERIDA');
    }
        // PASO A: Verificar Stock (Consulta externa)
        const stockActual = await this.stockAdapter.obtenerStock(platoId);
        
        // REGLA DE NEGOCIO 1: No vender lo que no hay
        if (stockActual <= 0) {
            // Lanzamos una Excepción de Negocio (No un error HTTP)
            throw new Error('STOCK_INSUFICIENTE');
        }

        // PASO B: Descontar Stock (Modificación externa)
        await this.stockAdapter.descontarStock(platoId, 1);

        // PASO C: Crear el Pedido (Persistencia Local)
        const nuevoPedido = await Pedido.create({
            mesa,
            cliente,
            PlatoId: platoId, 
            fecha: new Date(),
            estado: 'en_preparacion'
        });

        return nuevoPedido;
    }

    // LÓGICA: LISTAR PEDIDOS
    async listarPedidos() {
        const pedidos = await Pedido.findAll({
            order: [['createdAt', 'DESC']] 
        });
        return pedidos;
    }

    // 🆕 LÓGICA: ELIMINAR PEDIDO (Con reposición de stock)
    async eliminarPedido(id) {
        // 1. Buscar el pedido en MySQL para saber qué plato tenía
        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            throw new Error('PEDIDO_NO_ENCONTRADO');
        }

        // 2. Devolver el Stock a Mongo (Rollback)
        // Usamos el PlatoId que estaba guardado en el pedido para saber qué reponer
        // Solo reponemos si el pedido no estaba ya rechazado (opcional, pero buena práctica)
        if (pedido.estado !== 'rechazado') {
            await this.stockAdapter.reponerStock(pedido.PlatoId, 1);
        }

        // 3. Borrar físicamente de MySQL
        await pedido.destroy();

        return true; 
    }
}

module.exports = PedidoService;
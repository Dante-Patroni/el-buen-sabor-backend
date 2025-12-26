const { sequelize, Pedido, DetallePedido, Mesa } = require('./src/models');

async function cleanDatabase() {
    console.log("🧹 Iniciando Limpieza de Base de Datos...");

    try {
        // 1. Limpiar DetallePedidos (Hijos)
        await DetallePedido.destroy({ where: {}, truncate: false });
        console.log("✅ Detalles de Pedido eliminados.");

        // 2. Limpiar Pedidos (Padres)
        await Pedido.destroy({ where: {}, truncate: false });
        console.log("✅ Pedidos eliminados.");

        // 3. Resetear Mesas (Estado y Totales)
        await Mesa.update({
            estado: 'libre',
            totalActual: 0,
            mozoId: null
        }, { where: {} });
        console.log("✅ Mesas reseteadas a 'libre'.");

        console.log("✨ ¡Base de datos limpia y lista para usar! ✨");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al limpiar:", error);
        process.exit(1);
    }
}

cleanDatabase();

const fs = require('fs');
const path = require('path');

class StockAdapter {
    constructor() {
        // Simulamos la conexión al sistema Legacy
        this.stockFilePath = path.join(__dirname, '../../data/stock.json');
    }

    // Método asíncrono que devuelve una Promesa con la cantidad disponible
    async consultarStock(nombreIngrediente) {
        try {
            // 1. Leemos el archivo (IO Operation)
            // Usamos Promises de fs para no bloquear el hilo principal
            const data = await fs.promises.readFile(this.stockFilePath, 'utf-8');
            const stockList = JSON.parse(data);

            // 2. Buscamos el ingrediente
            const item = stockList.find(i => i.ingrediente === nombreIngrediente);

            // 3. Retornamos la cantidad (si no existe, asumimos 0)
            return item ? item.cantidadDisponible : 0;

        } catch (error) {
            console.error("Error crítico en StockAdapter:", error.message);
            // Si el sistema Legacy falla, por seguridad decimos que NO hay stock
            return 0; 
        }
    }
}

module.exports = new StockAdapter();
const fs = require('fs');// [A] File System (Nativo de Node)
const path = require('path');

class StockAdapter {
    constructor() {
        // Definimos la ruta al archivo "Base de Datos de Juguete"
        this.stockFilePath = path.join(__dirname, '../../data/stock.json');
    }

    // [B] La Interfaz (El Contrato)
    // El servicio espera que exista un método con este nombre exacto.
    async consultarStock(nombreIngrediente) {
        try {
            // [C] I/O Asíncrono (Input/Output)
            // Leemos el disco duro. Esto es lento, por eso usamos 'await'.
            const data = await fs.promises.readFile(this.stockFilePath, 'utf-8');
           
            // [D] Parsing (Texto -> Objeto)
            const stockList = JSON.parse(data);

            // [E] Lógica de Búsqueda
            const item = stockList.find(i => i.ingrediente === nombreIngrediente);

            // [F] Normalización
            // Devolvemos un número simple. Al servicio no le importa si vino de un JSON o de la NASA.
            return item ? item.cantidadDisponible : 0;

        } catch (error) {
            // [G] Manejo de Errores (Fail Safe)
            // Si el archivo no existe o se corrompe, no explotamos.
            // Devolvemos 0 para proteger el negocio (mejor no vender a vender sin stock).
            console.error("Error crítico en StockAdapter:", error.message);
            // Si el sistema Legacy falla, por seguridad decimos que NO hay stock
            return 0; 
        }
    }
}

module.exports = new StockAdapter();
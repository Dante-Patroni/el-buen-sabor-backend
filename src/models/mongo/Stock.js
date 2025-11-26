const mongoose = require('mongoose');

// Definimos cómo se ve un documento de Stock en Mongo
const StockSchema = new mongoose.Schema({
    platoId: {
        type: Number,
        required: true,
        unique: true // No puede haber dos stocks para el mismo plato
    },
    ingrediente: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        default: 0
    }
});

// Exportamos el modelo "Stock" (Mongoose creará la colección 'stocks' automáticamente)
module.exports = mongoose.model('Stock', StockSchema);
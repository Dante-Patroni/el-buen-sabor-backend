const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    platoId: {
        type: Number,
        required: true,
        unique: true
    },
    nombrePlato: { 
        type: String, 
        required: true 
    },
    stockDiario: {
        cantidadInicial: { type: Number, default: 0 },
        cantidadActual: { type: Number, required: true, default: 0 }, // Aquí mira la App
        esIlimitado: { type: Boolean, default: false }
    },
    ultimaActualizacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Stock', StockSchema);
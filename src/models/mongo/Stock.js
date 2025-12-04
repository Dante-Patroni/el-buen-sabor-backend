const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema(
    {
        platoId: { type: Number, required: true, unique: true },
        cantidad: { type: Number, default: 0 },
        esIlimitado: { type: Boolean, default: false }
    },
    { 
        timestamps: true,
        versionKey: false,
        strict: false // 💡 Truco de Profe: Esto permite leer campos aunque no estén perfectos en el esquema
    }
);

module.exports = mongoose.model('Stock', StockSchema);
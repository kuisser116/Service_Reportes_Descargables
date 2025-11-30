const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    lugar: { type: String },
    capacidadTotal: { type: Number, required: true },
    // Campos extra para cumplir DFR 1.1 aunque no se usen en el reporte
    descripcion: String,
    areas: [String]
});

module.exports = mongoose.model('Evento', eventoSchema);

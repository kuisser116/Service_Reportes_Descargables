const mongoose = require('mongoose');

const boletoSchema = new mongoose.Schema({
    folio: { type: String, required: true, unique: true },
    eventoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento', required: true },
    status: {
        type: String,
        enum: ['disponible', 'usado'],
        default: 'disponible'
    },
    fechaValidacion: Date,
    // Campos extra para cumplir DFR 3.2
    asiento: String,
    area: String,
    clienteEmail: String
});

module.exports = mongoose.model('Boleto', boletoSchema);

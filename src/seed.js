require('dotenv').config();
const mongoose = require('mongoose');
const Evento = require('./models/Evento');
const Boleto = require('./models/Boleto');
const connectDB = require('./database');

const seedData = async () => {
    await connectDB();

    console.log('Limpiando base de datos...');
    await Evento.deleteMany({});
    await Boleto.deleteMany({});

    console.log('Creando evento de prueba...');
    const evento = await Evento.create({
        nombre: 'Concierto de Prueba 2025',
        fecha: new Date(),
        lugar: 'Auditorio Principal',
        capacidadTotal: 100,
        descripcion: 'Evento generado automáticamente para probar reportes',
        areas: ['General', 'VIP']
    });

    console.log('Generando boletos...');
    const boletos = [];
    for (let i = 1; i <= 50; i++) {
        boletos.push({
            folio: `BOL-${i}`,
            eventoId: evento._id,
            status: i <= 30 ? 'validado' : 'vendido', // 30 validados, 20 solo vendidos
            fechaValidacion: i <= 30 ? new Date() : null,
            asiento: `A-${i}`,
            area: 'General',
            clienteEmail: `cliente${i}@test.com`
        });
    }

    await Boleto.insertMany(boletos);

    console.log('¡Datos de prueba insertados!');
    console.log(`ID del Evento para probar: ${evento._id}`);
    console.log('Usa este ID en la URL de los reportes.');

    process.exit();
};

seedData();

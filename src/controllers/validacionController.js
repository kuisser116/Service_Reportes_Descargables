const Boleto = require('../models/Boleto');

const validarBoleto = async (req, res) => {
    const { folio } = req.body;

    try {
        // Buscar el boleto por su folio único
        const boleto = await Boleto.findOne({ folio });

        // Req 5.1: Validación de boletos mediante QR (simulado con folio)
        if (!boleto) {
            return res.status(404).json({
                mensaje: 'Acceso denegado',
                error: 'Boleto no encontrado o folio inválido'
            });
        }

        // Req 5.2: Control de duplicidad
        if (boleto.status === 'validado') {
            return res.status(400).json({
                mensaje: 'Boleto ya registrado en el acceso',
                fechaValidacion: boleto.fechaValidacion
            });
        }

        // Si pasa las validaciones, permitimos el acceso
        boleto.status = 'validado';
        boleto.fechaValidacion = new Date();
        await boleto.save();

        res.status(200).json({
            mensaje: 'Acceso permitido',
            boleto: {
                folio: boleto.folio,
                asiento: boleto.asiento,
                area: boleto.area,
                status: boleto.status
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor al validar boleto' });
    }
};

module.exports = {
    validarBoleto
};

const Boleto = require('../models/Boleto');
const Evento = require('../models/Evento');
const PDFDocument = require('pdfkit-table');
const ExcelJS = require('exceljs');

const obtenerEstadisticas = async (eventoId) => {
    const evento = await Evento.findById(eventoId);
    if (!evento) throw new Error('Evento no encontrado');

    const totalBoletos = await Boleto.countDocuments({ eventoId });
    const boletosValidados = await Boleto.countDocuments({ eventoId, status: 'validado' });

    return {
        evento,
        totalBoletos, // Vendidos
        boletosValidados,
        capacidadTotal: evento.capacidadTotal,
        porcentajeAsistencia: totalBoletos > 0 ? ((boletosValidados / totalBoletos) * 100).toFixed(2) : 0
    };
};

// Req 5.3: Estadísticas en tiempo real
const verEstadisticas = async (req, res) => {
    const { eventoId } = req.params;
    try {
        const stats = await obtenerEstadisticas(eventoId);
        res.json({
            evento: stats.evento.nombre,
            capacidadTotal: stats.capacidadTotal,
            asistentesIngresados: stats.boletosValidados, // "Mostrar el número total de asistentes ingresados"
            capacidadRestante: stats.capacidadTotal - stats.boletosValidados, // "Mostrar capacidad restante del evento"
            porcentajeAsistencia: `${stats.porcentajeAsistencia}%`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
    }
};

const generarReportePDF = async (req, res) => {
    const { eventoId } = req.params;

    try {
        const stats = await obtenerEstadisticas(eventoId);

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${stats.evento.nombre}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de Asistencia: ${stats.evento.nombre}`, { align: 'center' });
        doc.moveDown();

        const table = {
            title: "Resumen General",
            headers: ["Concepto", "Cantidad"],
            rows: [
                ["Capacidad Total", stats.capacidadTotal],
                ["Boletos Vendidos", stats.totalBoletos],
                ["Boletos Validados (Asistencia)", stats.boletosValidados],
                ["Porcentaje de Asistencia", `${stats.porcentajeAsistencia}%`]
            ],
        };

        await doc.table(table, { width: 300 });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar el reporte PDF');
    }
};

const generarReporteExcel = async (req, res) => {
    const { eventoId } = req.params;

    try {
        const stats = await obtenerEstadisticas(eventoId);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Asistencia');

        worksheet.columns = [
            { header: 'Concepto', key: 'concepto', width: 30 },
            { header: 'Valor', key: 'valor', width: 15 },
        ];

        worksheet.addRow({ concepto: 'Evento', valor: stats.evento.nombre });
        worksheet.addRow({ concepto: 'Capacidad Total', valor: stats.capacidadTotal });
        worksheet.addRow({ concepto: 'Boletos Vendidos', valor: stats.totalBoletos });
        worksheet.addRow({ concepto: 'Boletos Validados', valor: stats.boletosValidados });
        worksheet.addRow({ concepto: 'Porcentaje Asistencia', valor: `${stats.porcentajeAsistencia}%` });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${stats.evento.nombre}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar el reporte Excel');
    }
};

module.exports = {
    verEstadisticas,
    generarReportePDF,
    generarReporteExcel
};

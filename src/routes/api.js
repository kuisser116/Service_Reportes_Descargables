const express = require('express');
const router = express.Router();
const { validarBoleto } = require('../controllers/validacionController');
const { generarReportePDF, generarReporteExcel, verEstadisticas } = require('../controllers/reporteController');

// Módulo 5.1 y 5.2: Validación
router.post('/validar', validarBoleto);

// Módulo 5.3: Estadísticas en tiempo real
router.get('/estadisticas/:eventoId', verEstadisticas);

// Módulo 5.4: Reportes descargables
router.get('/reporte/:eventoId/pdf', generarReportePDF);
router.get('/reporte/:eventoId/excel', generarReporteExcel);

module.exports = router;

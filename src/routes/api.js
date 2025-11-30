const express = require('express');
const router = express.Router();
const { generarReportePDF, generarReporteExcel } = require('../controllers/reporteController');

// Rutas exclusivas para Módulo 5.4 (Reportes)
router.get('/reporte/:eventoId/pdf', generarReportePDF);
router.get('/reporte/:eventoId/excel', generarReporteExcel);

module.exports = router;

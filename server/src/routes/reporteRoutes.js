const { Router } = require('express');
const { exportarReporteGeneral } = require('../controllers/reporteController.js');

const router = Router();

// Ruta para generar y descargar el reporte general
router.get('/general', exportarReporteGeneral);

module.exports = router;
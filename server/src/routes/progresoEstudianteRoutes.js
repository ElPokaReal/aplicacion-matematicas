const express = require('express');
const router = express.Router();
const progresoEstudianteController = require('../controllers/progresoEstudianteController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para ProgresoEstudiante
router.get('/', verifyToken, authorizeRoles(['maestro']), progresoEstudianteController.getAllProgresoEstudiantes);
router.get('/:id', verifyToken, authorizeRoles(['maestro', 'estudiante']), progresoEstudianteController.getProgresoEstudianteById);
router.post('/', verifyToken, authorizeRoles(['estudiante']), progresoEstudianteController.createProgresoEstudiante);
router.get('/estudiante/:estudiante_id', verifyToken, authorizeRoles(['maestro', 'estudiante']), progresoEstudianteController.getProgresoByEstudiante);
router.get('/estudiante/:studentId/aggregated-by-grade', verifyToken, authorizeRoles(['maestro', 'estudiante']), progresoEstudianteController.getAggregatedProgressByStudentAndGrade);
router.get('/estudiante/:studentId/grado/:grade/completed-exercises', verifyToken, authorizeRoles(['maestro', 'estudiante']), progresoEstudianteController.getCompletedExercisesByStudentAndGrade);

module.exports = router;

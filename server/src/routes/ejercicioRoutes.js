const express = require('express');
const router = express.Router();
const ejercicioController = require('../controllers/ejercicioController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para ejercicios
router.get('/', verifyToken, authorizeRoles(['maestro', 'estudiante']), ejercicioController.getAllEjercicios);
router.get('/:id', verifyToken, authorizeRoles(['maestro', 'estudiante']), ejercicioController.getEjercicioById);
router.post('/', verifyToken, authorizeRoles(['maestro']), ejercicioController.createEjercicio);
router.put('/:id', verifyToken, authorizeRoles(['maestro']), ejercicioController.updateEjercicio);
router.put('/:id', verifyToken, authorizeRoles(['maestro']), ejercicioController.updateEjercicio);
router.delete('/:id', authorizeRoles(['maestro']), ejercicioController.deleteEjercicio);
router.get('/count/grado/:grado', verifyToken, authorizeRoles(['maestro', 'estudiante']), ejercicioController.getTotalEjerciciosCountByGrado);

module.exports = router;

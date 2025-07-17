const express = require('express');
const router = express.Router();
const recompensaController = require('../controllers/recompensaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para Recompensas
router.get('/', verifyToken, authorizeRoles(['maestro', 'estudiante']), recompensaController.getAllRecompensas);
router.get('/:id', verifyToken, authorizeRoles(['maestro', 'estudiante']), recompensaController.getRecompensaById);
router.post('/', verifyToken, authorizeRoles(['maestro']), recompensaController.createRecompensa);
router.put('/:id', verifyToken, authorizeRoles(['maestro']), recompensaController.updateRecompensa);
router.delete('/:id', verifyToken, authorizeRoles(['maestro']), recompensaController.deleteRecompensa);

// Rutas para Recompensas Desbloqueadas
router.post('/unlock', verifyToken, authorizeRoles(['estudiante']), recompensaController.unlockRecompensa);
router.get('/estudiante/:estudiante_id', verifyToken, authorizeRoles(['maestro', 'estudiante']), recompensaController.getRecompensasDesbloqueadasByEstudiante);

module.exports = router;

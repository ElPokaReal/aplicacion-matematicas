const express = require('express');
const router = express.Router();
const logroController = require('../controllers/logroController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para Logros
router.get('/', verifyToken, authorizeRoles(['maestro', 'estudiante']), logroController.getAllLogros);
router.get('/:id', verifyToken, authorizeRoles(['maestro', 'estudiante']), logroController.getLogroById);
router.post('/', verifyToken, authorizeRoles(['maestro']), logroController.createLogro);
router.put('/:id', verifyToken, authorizeRoles(['maestro']), logroController.updateLogro);
router.delete('/:id', verifyToken, authorizeRoles(['maestro']), logroController.deleteLogro);

// Rutas para Logros Obtenidos
router.get('/estudiante/:estudiante_id', verifyToken, authorizeRoles(['maestro', 'estudiante']), logroController.getLogrosObtenidosByEstudiante);
router.post('/assign', verifyToken, authorizeRoles(['maestro']), logroController.addLogroToEstudiante);

module.exports = router;

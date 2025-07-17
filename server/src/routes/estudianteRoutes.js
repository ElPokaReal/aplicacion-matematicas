const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para estudiantes
router.get('/', verifyToken, authorizeRoles(['maestro']), estudianteController.getAllEstudiantes);
router.get('/:id', verifyToken, authorizeRoles(['maestro', 'estudiante']), estudianteController.getEstudianteById);
router.post('/register', verifyToken, authorizeRoles(['maestro']), estudianteController.registerEstudiante);
router.post('/login', estudianteController.loginEstudiante); // No auth needed for login
router.put('/:id', verifyToken, authorizeRoles(['maestro', 'estudiante']), estudianteController.updateEstudiante);
router.delete('/:id', verifyToken, authorizeRoles(['maestro']), estudianteController.deleteEstudiante);

module.exports = router;

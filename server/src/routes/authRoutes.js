const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para iniciar sesión de Maestro
router.post('/login', authController.loginMaestro);

// Ruta para registrar un nuevo Maestro (solo para configuración inicial)
router.post('/register', authController.registerMaestro);

// Ruta para cerrar sesión
router.post('/logout', authController.logoutUser);

module.exports = router;

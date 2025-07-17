const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para el dashboard - Solo maestros
router.get('/stats', verifyToken, authorizeRoles(['maestro']), dashboardController.getDashboardStats);
router.get('/exercise-performance', verifyToken, authorizeRoles(['maestro']), dashboardController.getExercisePerformanceStats);
router.get('/student-performance', verifyToken, authorizeRoles(['maestro']), dashboardController.getStudentPerformanceStats);
router.get('/achievement-reward-distribution', verifyToken, authorizeRoles(['maestro']), dashboardController.getAchievementRewardDistribution);

module.exports = router;

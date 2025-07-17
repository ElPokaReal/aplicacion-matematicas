const AppDataSource = require('../config/database');
const Estudiante = require('../entities/Estudiante');
const Ejercicio = require('../entities/Ejercicio');
const Logro = require('../entities/Logro');
const LogroObtenido = require('../entities/LogroObtenido');
const Recompensa = require('../entities/Recompensa');
const RecompensaDesbloqueada = require('../entities/RecompensaDesbloqueada');
const ProgresoEstudiante = require('../entities/ProgresoEstudiante');

exports.getDashboardStats = async (req, res) => {
    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const logroObtenidoRepository = AppDataSource.getRepository(LogroObtenido);
        const recompensaDesbloqueadaRepository = AppDataSource.getRepository(RecompensaDesbloqueada);

        const totalEstudiantes = await estudianteRepository.count();
        const totalEjercicios = await ejercicioRepository.count();
        const totalLogrosOtorgados = await logroObtenidoRepository.count();
        const totalRecompensasDesbloqueadas = await recompensaDesbloqueadaRepository.count();

        res.status(200).json({
            totalEstudiantes,
            totalEjercicios,
            totalLogrosOtorgados,
            totalRecompensasDesbloqueadas
        });

    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas.' });
    }
};

exports.getExercisePerformanceStats = async (req, res) => {
    try {
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);

        const stats = await progresoRepository
            .createQueryBuilder('progreso')
            .leftJoinAndSelect('progreso.ejercicio', 'ejercicio')
            .select('ejercicio.tipo_operacion', 'tipo_operacion')
            .addSelect('ejercicio.grado', 'grado')
            .addSelect('AVG(progreso.es_correcta)', 'average_correctness')
            .groupBy('ejercicio.tipo_operacion')
            .addGroupBy('ejercicio.grado')
            .getRawMany();

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error al obtener estadísticas de rendimiento de ejercicios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas de rendimiento de ejercicios.' });
    }
};

exports.getStudentPerformanceStats = async (req, res) => {
    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);

        const topStudents = await estudianteRepository.find({
            order: { puntos_recompensa: 'DESC' },
            take: 5,
            select: ['id', 'nombre', 'puntos_recompensa']
        });

        // You can add logic here to identify students needing help based on more complex criteria
        // For now, let's just return top students

        res.status(200).json({
            topStudents
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de rendimiento de estudiantes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas de rendimiento de estudiantes.' });
    }
};

exports.getAchievementRewardDistribution = async (req, res) => {
    try {
        const logroObtenidoRepository = AppDataSource.getRepository(LogroObtenido);
        const recompensaDesbloqueadaRepository = AppDataSource.getRepository(RecompensaDesbloqueada);

        const achievementDistribution = await logroObtenidoRepository
            .createQueryBuilder('logroObtenido')
            .leftJoinAndSelect('logroObtenido.logro', 'logro')
            .select('logro.nombre', 'logro_nombre')
            .addSelect('COUNT(logroObtenido.id)', 'count')
            .groupBy('logro.nombre')
            .getRawMany();

        const rewardDistribution = await recompensaDesbloqueadaRepository
            .createQueryBuilder('recompensaDesbloqueada')
            .leftJoinAndSelect('recompensaDesbloqueada.recompensa', 'recompensa')
            .select('recompensa.nombre', 'recompensa_nombre')
            .addSelect('COUNT(recompensaDesbloqueada.id)', 'count')
            .groupBy('recompensa.nombre')
            .getRawMany();

        res.status(200).json({
            achievementDistribution,
            rewardDistribution
        });
    } catch (error) {
        console.error('Error al obtener distribución de logros y recompensas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener distribución de logros y recompensas.' });
    }
};

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

exports.getRecentActivity = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const logroObtenidoRepository = AppDataSource.getRepository(require('../entities/LogroObtenido'));
        const recompensaDesbloqueadaRepository = AppDataSource.getRepository(require('../entities/RecompensaDesbloqueada'));
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const progresoRepository = AppDataSource.getRepository(require('../entities/ProgresoEstudiante'));

        // 1. Nuevos estudiantes registrados
        const nuevosEstudiantes = await estudianteRepository.find({
            order: { fecha_creacion: 'DESC' },
            take: 10
        });
        const eventosEstudiantes = nuevosEstudiantes.map(e => ({
            tipo: 'nuevo_estudiante',
            fecha: e.fecha_creacion,
            descripcion: `Nuevo estudiante registrado: ${e.nombre}`,
            estudiante: e.nombre
        }));

        // 2. Logros obtenidos
        const logros = await logroObtenidoRepository.find({
            relations: ['estudiante', 'logro'],
            order: { fecha_obtencion: 'DESC' },
            take: 10
        });
        const eventosLogros = logros.map(l => ({
            tipo: 'logro_obtenido',
            fecha: l.fecha_obtencion,
            descripcion: `El estudiante ${l.estudiante?.nombre || ''} obtuvo el logro "${l.logro?.nombre || ''}"`,
            estudiante: l.estudiante?.nombre,
            logro: l.logro?.nombre
        }));

        // 3. Recompensas canjeadas
        const recompensas = await recompensaDesbloqueadaRepository.find({
            relations: ['estudiante', 'recompensa'],
            order: { fecha_desbloqueo: 'DESC' },
            take: 10
        });
        const eventosRecompensas = recompensas.map(r => ({
            tipo: 'recompensa_canjeada',
            fecha: r.fecha_desbloqueo,
            descripcion: `El estudiante ${r.estudiante?.nombre || ''} canjeó la recompensa "${r.recompensa?.nombre || ''}"`,
            estudiante: r.estudiante?.nombre,
            recompensa: r.recompensa?.nombre
        }));

        // 4. Nuevos ejercicios creados
        const ejercicios = await ejercicioRepository.find({
            order: { fecha_creacion: 'DESC' },
            take: 10,
            relations: ['creado_por_maestro']
        });
        const eventosEjercicios = ejercicios.map(e => ({
            tipo: 'nuevo_ejercicio',
            fecha: e.fecha_creacion,
            descripcion: `Nuevo ejercicio creado: ${e.tipo_operacion} para ${e.grado}° grado`,
            ejercicio: e.id,
            grado: e.grado,
            maestro: e.creado_por_maestro?.nombre
        }));

        // 5. Cambios de estado de estudiantes (activado/desactivado)
        // NOTA: Esto solo funcionará si tienes un campo de fecha de cambio de estado o logs. Si no, solo muestra los más recientes con estado actual.
        const cambiosEstado = await estudianteRepository.find({
            order: { fecha_creacion: 'DESC' },
            take: 10
        });
        const eventosEstado = cambiosEstado
            .filter(e => e.esta_activo !== undefined)
            .map(e => ({
                tipo: e.esta_activo ? 'estudiante_activado' : 'estudiante_desactivado',
                fecha: e.fecha_creacion, // Idealmente deberías tener fecha de cambio de estado
                descripcion: `El estudiante ${e.nombre} fue ${e.esta_activo ? 'activado' : 'desactivado'}`,
                estudiante: e.nombre
            }));

        // 6. Estudiantes que completaron todos los ejercicios de un grado (evento real)
        const EventoDashboard = require('../entities/EventoDashboard');
        const eventoRepository = AppDataSource.getRepository(EventoDashboard);
        const eventosCompletos = await eventoRepository.find({
            relations: ['estudiante'],
            where: { tipo: 'completo_grado' },
            order: { fecha: 'DESC' },
            take: 10
        });
        const eventosCompletosMap = eventosCompletos.map(ev => ({
            tipo: 'completo_grado',
            fecha: ev.fecha,
            descripcion: ev.descripcion,
            estudiante: ev.estudiante?.nombre,
            grado: ev.grado
        }));

        // Unir y ordenar todos los eventos por fecha descendente
        let eventos = [
            ...eventosEstudiantes,
            ...eventosLogros,
            ...eventosRecompensas,
            ...eventosEjercicios,
            ...eventosEstado,
            ...eventosCompletosMap
        ];
        eventos = eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const total = eventos.length;
        const eventosPaginados = eventos.slice(offset, offset + limit);
        res.status(200).json({ eventos: eventosPaginados, total });
    } catch (error) {
        console.error('Error al obtener actividad reciente:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener actividad reciente.' });
    }
};

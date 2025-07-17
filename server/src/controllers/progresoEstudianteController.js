const AppDataSource = require('../config/database');
const ProgresoEstudiante = require('../entities/ProgresoEstudiante');
const Estudiante = require('../entities/Estudiante');
const Ejercicio = require('../entities/Ejercicio');
const Logro = require('../entities/Logro');
const LogroObtenido = require('../entities/LogroObtenido');
const Recompensa = require('../entities/Recompensa');
const RecompensaDesbloqueada = require('../entities/RecompensaDesbloqueada');

// Obtener todo el progreso de los estudiantes
exports.getAllProgresoEstudiantes = async (req, res) => {
    try {
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);
        const progresos = await progresoRepository.find({ relations: ['estudiante', 'ejercicio'] });
        res.status(200).json(progresos);
    } catch (error) {
        console.error('Error al obtener progreso de estudiantes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el progreso.' });
    }
};

// Obtener progreso por ID
exports.getProgresoEstudianteById = async (req, res) => {
    const { id } = req.params;
    try {
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);
        const progreso = await progresoRepository.findOne({ where: { id }, relations: ['estudiante', 'ejercicio'] });
        if (!progreso) {
            return res.status(404).json({ message: 'Progreso no encontrado.' });
        }
        res.status(200).json(progreso);
    } catch (error) {
        console.error(`Error al obtener progreso con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el progreso.' });
    }
};

// Registrar el progreso de un estudiante
exports.createProgresoEstudiante = async (req, res) => {
    const { ejercicio_id, respuesta_enviada, es_correcta } = req.body;
    const estudiante_id = req.user.id; // ID del estudiante logueado

    if (!ejercicio_id || !respuesta_enviada || es_correcta === undefined) {
        return res.status(400).json({ message: 'Ejercicio, respuesta y estado de corrección son obligatorios.' });
    }

    try {
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);

        const estudiante = await estudianteRepository.findOne({ where: { id: estudiante_id } });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        const ejercicio = await ejercicioRepository.findOne({ where: { id: ejercicio_id } });
        if (!ejercicio) {
            return res.status(404).json({ message: 'Ejercicio no encontrado.' });
        }

        const nuevoProgreso = progresoRepository.create({
            estudiante,
            ejercicio,
            respuesta_enviada,
            es_correcta
        });

        await progresoRepository.save(nuevoProgreso);

        // If the answer is correct, update student's reward points
        if (es_correcta) {
            const POINTS_PER_CORRECT_ANSWER = 10; // Define points for a correct answer
            estudiante.puntos_recompensa = (estudiante.puntos_recompensa || 0) + POINTS_PER_CORRECT_ANSWER;
            await estudianteRepository.save(estudiante);
        }

        // If the answer is correct, update student's reward points
        if (es_correcta) {
            const POINTS_PER_CORRECT_ANSWER = 10; // Define points for a correct answer
            estudiante.puntos_recompensa = (estudiante.puntos_recompensa || 0) + POINTS_PER_CORRECT_ANSWER;
            await estudianteRepository.save(estudiante);

            // Check and award achievements
            await checkAndAwardAchievements(estudiante, ejercicio);
            // Check and unlock rewards
            await checkAndUnlockRewards(estudiante);
        }

        // Lógica: Si la respuesta es correcta, verificar si el estudiante completó todos los ejercicios del grado
        if (es_correcta) {
            const ejercicioGrado = ejercicio.grado;
            // 1. Obtener todos los ejercicios de ese grado
            const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
            const totalEjercicios = await ejercicioRepository.count({ where: { grado: ejercicioGrado } });
            // 2. Obtener IDs de ejercicios completados correctamente por el estudiante en ese grado
            const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);
            const completados = await progresoRepository
                .createQueryBuilder('progreso')
                .leftJoin('progreso.ejercicio', 'ejercicio')
                .select('ejercicio.id', 'ejercicioId')
                .where('progreso.estudiante.id = :estudianteId', { estudianteId: estudiante.id })
                .andWhere('progreso.es_correcta = true')
                .andWhere('ejercicio.grado = :grado', { grado: ejercicioGrado })
                .groupBy('ejercicio.id')
                .getRawMany();
            if (completados.length === totalEjercicios && totalEjercicios > 0) {
                // Registrar evento (puede repetirse si se agregan nuevos ejercicios)
                const EventoDashboard = require('../entities/EventoDashboard');
                const eventoRepository = AppDataSource.getRepository(EventoDashboard);
                await eventoRepository.save({
                    tipo: 'completo_grado',
                    descripcion: `El estudiante ${estudiante.nombre} completó todos los ejercicios del grado ${ejercicioGrado}`,
                    estudiante: { id: estudiante.id },
                    grado: ejercicioGrado
                });
            }
        }

        res.status(201).json({ message: 'Progreso registrado exitosamente.', progreso: nuevoProgreso, estudiante: estudiante });

    } catch (error) {
        console.error('Error al registrar progreso del estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar el progreso.' });
    }
};

// Helper function to check and award achievements
async function checkAndAwardAchievements(estudiante, ejercicio) {
    const logroRepository = AppDataSource.getRepository(Logro);
    const logroObtenidoRepository = AppDataSource.getRepository(LogroObtenido);
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
    const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);

    const allLogros = await logroRepository.find();

    for (const logro of allLogros) {
        const alreadyObtained = await logroObtenidoRepository.findOne({
            where: { estudiante: { id: estudiante.id }, logro: { id: logro.id } }
        });

        if (alreadyObtained) {
            continue; // Skip if already obtained
        }

        let shouldAward = false;

        switch (logro.tipo_logro) {
            case 'ejercicios_completados':
                const completedExercisesCount = await progresoRepository.count({
                    where: { estudiante: { id: estudiante.id }, es_correcta: true }
                });
                if (completedExercisesCount >= logro.valor_requerido) {
                    shouldAward = true;
                }
                break;
            case 'puntos_acumulados':
                if (estudiante.puntos_recompensa >= logro.valor_requerido) {
                    shouldAward = true;
                }
                break;
            case 'ejercicios_por_grado':
                const completedExercisesByGrade = await progresoRepository
                    .createQueryBuilder('progreso')
                    .select('COUNT(DISTINCT ejercicio.id)', 'count')
                    .innerJoin('progreso.ejercicio', 'ejercicio')
                    .where('progreso.estudiante.id = :estudianteId', { estudianteId: estudiante.id })
                    .andWhere('progreso.es_correcta = :esCorrecta', { esCorrecta: true })
                    .andWhere('ejercicio.grado = :grado', { grado: logro.criterio_adicional }) // criterio_adicional para el grado
                    .getRawOne();
                if (completedExercisesByGrade && completedExercisesByGrade.count >= logro.valor_requerido) {
                    shouldAward = true;
                }
                break;
            // Add more achievement types as needed
        }

        if (shouldAward) {
            const nuevoLogroObtenido = logroObtenidoRepository.create({
                estudiante,
                logro
            });
            await logroObtenidoRepository.save(nuevoLogroObtenido);

            // Award points for the achievement
            estudiante.puntos_recompensa += logro.puntos_otorgados;
            await estudianteRepository.save(estudiante);
            console.log(`Logro "${logro.nombre}" obtenido por ${estudiante.nombre}!`);
        }
    }
}

// Helper function to check and unlock rewards
async function checkAndUnlockRewards(estudiante) {
    const recompensaRepository = AppDataSource.getRepository(Recompensa);
    const recompensaDesbloqueadaRepository = AppDataSource.getRepository(RecompensaDesbloqueada);
    const estudianteRepository = AppDataSource.getRepository(Estudiante);

    const allRecompensas = await recompensaRepository.find();

    for (const recompensa of allRecompensas) {
        const alreadyUnlocked = await recompensaDesbloqueadaRepository.findOne({
            where: { estudiante: { id: estudiante.id }, recompensa: { id: recompensa.id } }
        });

        if (alreadyUnlocked) {
            continue; // Skip if already unlocked
        }

        if (estudiante.puntos_recompensa >= recompensa.costo_en_puntos) {
            // Unlock the reward
            const nuevaRecompensaDesbloqueada = recompensaDesbloqueadaRepository.create({
                estudiante,
                recompensa
            });
            await recompensaDesbloqueadaRepository.save(nuevaRecompensaDesbloqueada);

            
            console.log(`Recompensa "${recompensa.nombre}" desbloqueada por ${estudiante.nombre}!`);
        }
    }
}

// Obtener progreso de un estudiante específico
exports.getProgresoByEstudiante = async (req, res) => {
    const { estudiante_id } = req.params;
    try {
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);
        const progresos = await progresoRepository.find({
            where: { estudiante: { id: estudiante_id } },
            relations: ['ejercicio'],
            order: { fecha_intento: 'DESC' }
        });
        res.status(200).json(progresos);
    } catch (error) {
        console.error(`Error al obtener progreso del estudiante ${estudiante_id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el progreso.' });
    }
};

// Obtener el conteo de ejercicios completados correctamente por un estudiante para un grado específico
exports.getCompletedExercisesByStudentAndGrade = async (req, res) => {
    const { studentId, grade } = req.params;
    try {
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);

        const completedExercises = await progresoRepository
            .createQueryBuilder('progreso')
            .select('DISTINCT ejercicio.id', 'ejercicioId')
            .innerJoin('progreso.ejercicio', 'ejercicio')
            .where('progreso.estudiante.id = :studentId', { studentId: parseInt(studentId) })
            .andWhere('progreso.es_correcta = :esCorrecta', { esCorrecta: true })
            .andWhere('ejercicio.grado = :grade', { grade: parseInt(grade) })
            .getRawMany();

        res.status(200).json(completedExercises.map(row => row.ejercicioId));
    } catch (error) {
        console.error(`Error al obtener ejercicios completados para el estudiante ${studentId} y grado ${grade}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener ejercicios completados.' });
    }
};

exports.getAggregatedProgressByStudentAndGrade = async (req, res) => {
    const { studentId } = req.params;
    try {
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const progresoRepository = AppDataSource.getRepository(ProgresoEstudiante);

        // 1. Obtener todos los grados y el total de ejercicios por grado
        const ejerciciosPorGrado = await ejercicioRepository
            .createQueryBuilder('ejercicio')
            .select('ejercicio.grado', 'grado')
            .addSelect('COUNT(ejercicio.id)', 'total_ejercicios')
            .groupBy('ejercicio.grado')
            .getRawMany();

        // 2. Obtener ejercicios completados por el estudiante por grado
        const completadosPorGrado = await progresoRepository
            .createQueryBuilder('progreso')
            .leftJoin('progreso.ejercicio', 'ejercicio')
            .select('ejercicio.grado', 'grado')
            .addSelect('COUNT(DISTINCT ejercicio.id)', 'ejercicios_completados')
            .where('progreso.estudiante.id = :studentId', { studentId: parseInt(studentId) })
            .andWhere('progreso.es_correcta = TRUE')
            .groupBy('ejercicio.grado')
            .getRawMany();

        // 3. Unir ambos resultados
        const completadosMap = {};
        completadosPorGrado.forEach(row => {
            completadosMap[row.grado] = parseInt(row.ejercicios_completados, 10);
        });

        const result = ejerciciosPorGrado.map(row => ({
            grado: row.grado,
            total_ejercicios: parseInt(row.total_ejercicios, 10),
            ejercicios_completados: completadosMap[row.grado] || 0
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error(`Error al obtener progreso agregado por estudiante y grado ${studentId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener progreso agregado.' });
    }
};

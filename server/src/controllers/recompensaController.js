const AppDataSource = require('../config/database');
const Recompensa = require('../entities/Recompensa');
const RecompensaDesbloqueada = require('../entities/RecompensaDesbloqueada');
const Estudiante = require('../entities/Estudiante');

// Obtener todas las recompensas
exports.getAllRecompensas = async (req, res) => {
    try {
        const recompensaRepository = AppDataSource.getRepository(Recompensa);
        const recompensas = await recompensaRepository.find({ where: { maestro: { id: req.user.id } } });
        res.status(200).json(recompensas);
    } catch (error) {
        console.error('Error al obtener recompensas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener recompensas.' });
    }
};

// Obtener una recompensa por ID
exports.getRecompensaById = async (req, res) => {
    const { id } = req.params;
    try {
        const recompensaRepository = AppDataSource.getRepository(Recompensa);
        const recompensa = await recompensaRepository.findOne({ where: { id } });
        if (!recompensa) {
            return res.status(404).json({ message: 'Recompensa no encontrada.' });
        }
        res.status(200).json(recompensa);
    } catch (error) {
        console.error(`Error al obtener recompensa con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la recompensa.' });
    }
};

// Crear una nueva recompensa (solo para maestros)
exports.createRecompensa = async (req, res) => {
    const { nombre, descripcion, costo_puntos, icono_nombre } = req.body;

    if (!nombre || costo_puntos === undefined) {
        return res.status(400).json({ message: 'Nombre y costo en puntos son obligatorios.' });
    }

    try {
        const recompensaRepository = AppDataSource.getRepository(Recompensa);
        const existingRecompensa = await recompensaRepository.findOne({ where: { nombre } });
        if (existingRecompensa) {
            return res.status(400).json({ message: 'Ya existe una recompensa con ese nombre.' });
        }

        const nuevaRecompensa = recompensaRepository.create({
            nombre,
            descripcion,
            costo_puntos,
            icono_nombre,
            maestro: { id: req.user.id }
        });

        await recompensaRepository.save(nuevaRecompensa);
        res.status(201).json({ message: 'Recompensa creada exitosamente.', recompensa: nuevaRecompensa });
    } catch (error) {
        console.error('Error al crear recompensa:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la recompensa.' });
    }
};

// Actualizar una recompensa (solo para maestros)
exports.updateRecompensa = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, costo_puntos, icono_nombre } = req.body;

    try {
        const recompensaRepository = AppDataSource.getRepository(Recompensa);
        let recompensa = await recompensaRepository.findOne({ where: { id }, relations: ['maestro'] });
        if (!recompensa) {
            return res.status(404).json({ message: 'Recompensa no encontrada.' });
        }
        if (!recompensa.maestro || recompensa.maestro.id !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta recompensa.' });
        }
        if (nombre && nombre !== recompensa.nombre) {
            const existingRecompensa = await recompensaRepository.findOne({ where: { nombre } });
            if (existingRecompensa && existingRecompensa.id !== recompensa.id) {
                return res.status(400).json({ message: 'Ya existe una recompensa con ese nombre.' });
            }
            recompensa.nombre = nombre;
        }
        if (descripcion) recompensa.descripcion = descripcion;
        if (costo_puntos !== undefined) recompensa.costo_puntos = costo_puntos;
        if (icono_nombre) recompensa.icono_nombre = icono_nombre;

        await recompensaRepository.save(recompensa);
        res.status(200).json({ message: 'Recompensa actualizada exitosamente.', recompensa });
    } catch (error) {
        console.error(`Error al actualizar recompensa con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la recompensa.' });
    }
};

// Eliminar una recompensa (solo para maestros)
exports.deleteRecompensa = async (req, res) => {
    const { id } = req.params;
    try {
        const recompensaRepository = AppDataSource.getRepository(Recompensa);
        const recompensa = await recompensaRepository.findOne({ where: { id } });
        if (!recompensa) {
            return res.status(404).json({ message: 'Recompensa no encontrada.' });
        }

        await recompensaRepository.remove(recompensa);
        res.status(200).json({ message: 'Recompensa eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar recompensa con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la recompensa.' });
    }
};

// Desbloquear una recompensa para un estudiante
exports.unlockRecompensa = async (req, res) => {
    const { recompensa_id } = req.body;
    const estudiante_id = req.user.id; // El estudiante que está logueado

    try {
        const recompensaDesbloqueadaRepository = AppDataSource.getRepository(RecompensaDesbloqueada);
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const recompensaRepository = AppDataSource.getRepository(Recompensa);

        const estudiante = await estudianteRepository.findOne({ where: { id: estudiante_id } });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        const recompensa = await recompensaRepository.findOne({ where: { id: recompensa_id } });
        if (!recompensa) {
            return res.status(404).json({ message: 'Recompensa no encontrada.' });
        }

        // Verificar si el estudiante ya tiene esta recompensa desbloqueada
        const existingRecompensaDesbloqueada = await recompensaDesbloqueadaRepository.findOne({
            where: { estudiante: { id: estudiante_id }, recompensa: { id: recompensa_id } }
        });
        if (existingRecompensaDesbloqueada) {
            return res.status(400).json({ message: 'El estudiante ya ha desbloqueado esta recompensa.' });
        }

        // Usar costo_puntos para la validación
        if (estudiante.puntos_recompensa < recompensa.costo_puntos) {
            return res.status(400).json({ message: 'Puntos de recompensa insuficientes.' });
        }

        const nuevaRecompensaDesbloqueada = recompensaDesbloqueadaRepository.create({
            estudiante,
            recompensa
        });

        await recompensaDesbloqueadaRepository.save(nuevaRecompensaDesbloqueada);

        res.status(201).json({ message: 'Recompensa desbloqueada exitosamente.', recompensaDesbloqueada: nuevaRecompensaDesbloqueada, nuevos_puntos: estudiante.puntos_recompensa });

    } catch (error) {
        console.error('Error al desbloquear recompensa:', error);
        res.status(500).json({ message: 'Error interno del servidor al desbloquear la recompensa.' });
    }
};

// Obtener recompensas desbloqueadas por un estudiante
exports.getRecompensasDesbloqueadasByEstudiante = async (req, res) => {
    const { estudiante_id } = req.params;
    try {
        const recompensaDesbloqueadaRepository = AppDataSource.getRepository(RecompensaDesbloqueada);
        const recompensasDesbloqueadas = await recompensaDesbloqueadaRepository.find({
            where: { estudiante: { id: estudiante_id } },
            relations: ['recompensa', 'estudiante']
        });
        res.status(200).json(recompensasDesbloqueadas);
    } catch (error) {
        console.error(`Error al obtener recompensas desbloqueadas para el estudiante ${estudiante_id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener recompensas desbloqueadas.' });
    }
};

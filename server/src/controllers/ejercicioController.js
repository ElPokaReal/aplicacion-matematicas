const AppDataSource = require('../config/database');
const Ejercicio = require('../entities/Ejercicio');
const Maestro = require('../entities/Maestro');

// Obtener todos los ejercicios
exports.getAllEjercicios = async (req, res) => {
    try {
        const { grado } = req.query;
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        
        let findOptions = { relations: ['creado_por_maestro'] };

        if (grado) {
            findOptions.where = { grado: parseInt(grado) };
        }

        const ejercicios = await ejercicioRepository.find(findOptions);
        res.status(200).json(ejercicios);
    } catch (error) {
        console.error('Error al obtener ejercicios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener ejercicios.' });
    }
};

// Obtener un ejercicio por ID
exports.getEjercicioById = async (req, res) => {
    const { id } = req.params;
    try {
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const ejercicio = await ejercicioRepository.findOne({ where: { id }, relations: ['creado_por_maestro'] });
        if (!ejercicio) {
            return res.status(404).json({ message: 'Ejercicio no encontrado.' });
        }
        res.status(200).json(ejercicio);
    } catch (error) {
        console.error(`Error al obtener ejercicio con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el ejercicio.' });
    }
};

// Crear un nuevo ejercicio (solo para maestros)
exports.createEjercicio = async (req, res) => {
    const { grado, tipo_operacion, pregunta, respuesta_correcta } = req.body;

    if (!grado || !tipo_operacion || !pregunta || !respuesta_correcta) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const maestroRepository = AppDataSource.getRepository(Maestro);

        const creado_por_maestro = await maestroRepository.findOne({ where: { id: req.user.id } });
        if (!creado_por_maestro) {
            return res.status(400).json({ message: 'El maestro creador no existe.' });
        }

        const nuevoEjercicio = ejercicioRepository.create({
            grado,
            tipo_operacion,
            pregunta,
            respuesta_correcta,
            creado_por_maestro
        });

        await ejercicioRepository.save(nuevoEjercicio);
        res.status(201).json({ message: 'Ejercicio creado exitosamente.', ejercicio: nuevoEjercicio });
    } catch (error) {
        console.error('Error al crear ejercicio:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el ejercicio.' });
    }
};

// Actualizar un ejercicio (solo para maestros)
exports.updateEjercicio = async (req, res) => {
    const { id } = req.params;
    const { grado, tipo_operacion, pregunta, respuesta_correcta } = req.body;

    try {
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        let ejercicio = await ejercicioRepository.findOne({ where: { id }, relations: ['creado_por_maestro'] });
        if (!ejercicio) {
            return res.status(404).json({ message: 'Ejercicio no encontrado.' });
        }

        // Solo el maestro que lo creó o un admin (si hubiera) debería poder actualizarlo
        if (req.user.role === 'maestro' && ejercicio.creado_por_maestro.id !== req.user.id) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para actualizar este ejercicio.' });
        }

        if (grado) ejercicio.grado = parseInt(grado);
        if (tipo_operacion) ejercicio.tipo_operacion = tipo_operacion;
        if (pregunta) ejercicio.pregunta = pregunta;
        if (respuesta_correcta) ejercicio.respuesta_correcta = respuesta_correcta;

        await ejercicioRepository.save(ejercicio);
        res.status(200).json({ message: 'Ejercicio actualizado exitosamente.', ejercicio });
    } catch (error) {
        console.error(`Error al actualizar ejercicio con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el ejercicio.' });
    }
};

// Eliminar un ejercicio (solo para maestros)
// Obtener el conteo total de ejercicios por grado
exports.getTotalEjerciciosCountByGrado = async (req, res) => {
    const { grado } = req.params;
    try {
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const totalCount = await ejercicioRepository.count({ where: { grado: parseInt(grado) } });
        res.status(200).json({ count: totalCount });
    } catch (error) {
        console.error(`Error al obtener el conteo total de ejercicios para el grado ${grado}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el conteo total de ejercicios.' });
    }
};

exports.deleteEjercicio = async (req, res) => {
    const { id } = req.params;
    try {
        const ejercicioRepository = AppDataSource.getRepository(Ejercicio);
        const ejercicio = await ejercicioRepository.findOne({ where: { id }, relations: ['creado_por_maestro'] });
        if (!ejercicio) {
            return res.status(404).json({ message: 'Ejercicio no encontrado.' });
        }

        // Solo el maestro que lo creó o un admin (si hubiera) debería poder eliminarlo
        if (req.user.role === 'maestro' && ejercicio.creado_por_maestro.id !== req.user.id) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para eliminar este ejercicio.' });
        }

        await ejercicioRepository.remove(ejercicio);
        res.status(200).json({ message: 'Ejercicio eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar ejercicio con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el ejercicio.' });
    }
};

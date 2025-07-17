const AppDataSource = require('../config/database');
const Logro = require('../entities/Logro');
const LogroObtenido = require('../entities/LogroObtenido');
const Estudiante = require('../entities/Estudiante');

// Obtener todos los logros
exports.getAllLogros = async (req, res) => {
    try {
        const logroRepository = AppDataSource.getRepository(Logro);
        const logros = await logroRepository.find({ where: { maestro: { id: req.user.id } } });
        res.status(200).json(logros);
    } catch (error) {
        console.error('Error al obtener logros:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener logros.' });
    }
};

// Obtener un logro por ID
exports.getLogroById = async (req, res) => {
    const { id } = req.params;
    try {
        const logroRepository = AppDataSource.getRepository(Logro);
        const logro = await logroRepository.findOne({ where: { id } });
        if (!logro) {
            return res.status(404).json({ message: 'Logro no encontrado.' });
        }
        res.status(200).json(logro);
    } catch (error) {
        console.error(`Error al obtener logro con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el logro.' });
    }
};

// Crear un nuevo logro (solo para maestros)
exports.createLogro = async (req, res) => {
    const { nombre, descripcion, icono_nombre, puntos_otorgados, tipo_logro, valor_requerido, criterio_adicional } = req.body;

    if (!nombre || !descripcion || puntos_otorgados === undefined) {
        return res.status(400).json({ message: 'Nombre, descripción y puntos otorgados son obligatorios.' });
    }

    try {
        const logroRepository = AppDataSource.getRepository(Logro);
        const existingLogro = await logroRepository.findOne({ where: { nombre } });
        if (existingLogro) {
            return res.status(400).json({ message: 'Ya existe un logro con ese nombre.' });
        }

        const nuevoLogro = logroRepository.create({
            nombre,
            descripcion,
            icono_nombre,
            puntos_otorgados,
            tipo_logro,
            valor_requerido,
            criterio_adicional,
            maestro: { id: req.user.id }
        });

        await logroRepository.save(nuevoLogro);
        res.status(201).json({ message: 'Logro creado exitosamente.', logro: nuevoLogro });
    } catch (error) {
        console.error('Error al crear logro:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el logro.' });
    }
};

// Actualizar un logro (solo para maestros)
exports.updateLogro = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, icono_nombre, puntos_otorgados, tipo_logro, valor_requerido, criterio_adicional } = req.body;

    try {
        const logroRepository = AppDataSource.getRepository(Logro);
        let logro = await logroRepository.findOne({ where: { id }, relations: ['maestro'] });
        if (!logro) {
            return res.status(404).json({ message: 'Logro no encontrado.' });
        }
        if (!logro.maestro || logro.maestro.id !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para editar este logro.' });
        }
        if (nombre && nombre !== logro.nombre) {
            const existingLogro = await logroRepository.findOne({ where: { nombre } });
            if (existingLogro && existingLogro.id !== logro.id) {
                return res.status(400).json({ message: 'Ya existe un logro con ese nombre.' });
            }
            logro.nombre = nombre;
        }
        if (descripcion) logro.descripcion = descripcion;
        if (icono_nombre) logro.icono_nombre = icono_nombre;
        if (puntos_otorgados !== undefined) logro.puntos_otorgados = puntos_otorgados;
        if (tipo_logro) logro.tipo_logro = tipo_logro;
        if (valor_requerido !== undefined) logro.valor_requerido = valor_requerido;
        if (criterio_adicional) logro.criterio_adicional = criterio_adicional;

        await logroRepository.save(logro);
        res.status(200).json({ message: 'Logro actualizado exitosamente.', logro });
    } catch (error) {
        console.error(`Error al actualizar logro con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el logro.' });
    }
};

// Eliminar un logro (solo para maestros)
exports.deleteLogro = async (req, res) => {
    const { id } = req.params;
    try {
        const logroRepository = AppDataSource.getRepository(Logro);
        const logro = await logroRepository.findOne({ where: { id } });
        if (!logro) {
            return res.status(404).json({ message: 'Logro no encontrado.' });
        }

        await logroRepository.remove(logro);
        res.status(200).json({ message: 'Logro eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar logro con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el logro.' });
    }
};

// Obtener logros obtenidos por un estudiante
exports.getLogrosObtenidosByEstudiante = async (req, res) => {
    const { estudiante_id } = req.params;
    try {
        const logroObtenidoRepository = AppDataSource.getRepository(LogroObtenido);
        const logrosObtenidos = await logroObtenidoRepository.find({
            where: { estudiante: { id: estudiante_id } },
            relations: ['logro', 'estudiante']
        });
        res.status(200).json(logrosObtenidos);
    } catch (error) {
        console.error(`Error al obtener logros obtenidos para el estudiante ${estudiante_id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener logros obtenidos.' });
    }
};

// Registrar un logro obtenido por un estudiante (solo para maestros)
exports.addLogroToEstudiante = async (req, res) => {
    const { estudiante_id, logro_id } = req.body;

    try {
        const logroObtenidoRepository = AppDataSource.getRepository(LogroObtenido);
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const logroRepository = AppDataSource.getRepository(Logro);

        const estudiante = await estudianteRepository.findOne({ where: { id: estudiante_id } });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        const logro = await logroRepository.findOne({ where: { id: logro_id } });
        if (!logro) {
            return res.status(404).json({ message: 'Logro no encontrado.' });
        }

        // Verificar si el estudiante ya tiene este logro
        const existingLogroObtenido = await logroObtenidoRepository.findOne({
            where: { estudiante: { id: estudiante_id }, logro: { id: logro_id } }
        });
        if (existingLogroObtenido) {
            return res.status(400).json({ message: 'El estudiante ya ha obtenido este logro.' });
        }

        const nuevoLogroObtenido = logroObtenidoRepository.create({
            estudiante,
            logro
        });

        await logroObtenidoRepository.save(nuevoLogroObtenido);

        // Sumar puntos de recompensa al estudiante
        estudiante.puntos_recompensa += logro.puntos_otorgados;
        await estudianteRepository.save(estudiante);

        res.status(201).json({ message: 'Logro asignado exitosamente al estudiante.', logroObtenido: nuevoLogroObtenido });

    } catch (error) {
        console.error('Error al asignar logro al estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor al asignar logro.' });
    }
};

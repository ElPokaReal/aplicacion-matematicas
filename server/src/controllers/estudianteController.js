const AppDataSource = require('../config/database');
const Estudiante = require('../entities/Estudiante');
const Maestro = require('../entities/Maestro');
const jwt = require('jsonwebtoken');

// Obtener todos los estudiantes (solo para maestros)
exports.getAllEstudiantes = async (req, res) => {
    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const estudiantes = await estudianteRepository.find({ relations: ['maestro'] });
        res.status(200).json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estudiantes.' });
    }
};

// Obtener un estudiante por ID (solo para maestros o el propio estudiante)
exports.getEstudianteById = async (req, res) => {
    const { id } = req.params;
    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const estudiante = await estudianteRepository.findOne({ where: { id }, relations: ['maestro'] });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
        // Permitir acceso si es maestro o el propio estudiante
        if (req.user.role === 'maestro' || req.user.id === estudiante.id) {
            res.status(200).json(estudiante);
        } else {
            res.status(403).json({ message: 'Acceso denegado. No tiene permisos para ver este estudiante.' });
        }
    } catch (error) {
        console.error(`Error al obtener estudiante con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el estudiante.' });
    }
};

// Registrar un nuevo estudiante (solo para maestros)
exports.registerEstudiante = async (req, res) => {
    const { nombre, usuario, codigo_alumno, grado, maestro_id } = req.body;

    if (!nombre || !usuario || !codigo_alumno || !grado || !maestro_id) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const maestroRepository = AppDataSource.getRepository(Maestro);

        // Verificar si el usuario o código de alumno ya existen
        const existingEstudiante = await estudianteRepository.findOne({ where: [{ usuario }, { codigo_alumno }] });
        if (existingEstudiante) {
            return res.status(400).json({ message: 'El nombre de usuario o el código de alumno ya están en uso.' });
        }

        // Buscar el maestro
        const maestro = await maestroRepository.findOne({ where: { id: maestro_id } });
        if (!maestro) {
            return res.status(400).json({ message: 'El maestro especificado no existe.' });
        }

        const nuevoEstudiante = estudianteRepository.create({
            nombre,
            usuario,
            codigo_alumno,
            grado,
            maestro,
            puntos_recompensa: 0 // Puntos iniciales
        });

        await estudianteRepository.save(nuevoEstudiante);

        res.status(201).json({ message: 'Estudiante registrado exitosamente.', estudiante: { id: nuevoEstudiante.id, nombre: nuevoEstudiante.nombre, usuario: nuevoEstudiante.usuario, codigo_alumno: nuevoEstudiante.codigo_alumno } });

    } catch (error) {
        console.error('Error al registrar estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar estudiante.' });
    }
};

// Actualizar un estudiante (solo para maestros o el propio estudiante)
exports.updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, codigo_alumno, grado, maestro_id, puntos_recompensa, esta_activo } = req.body;

    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const maestroRepository = AppDataSource.getRepository(Maestro);

        let estudiante = await estudianteRepository.findOne({ where: { id } });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        // Permitir actualización solo si es maestro o el propio estudiante
        if (req.user.role === 'maestro' || req.user.id === estudiante.id) {
            if (nombre) estudiante.nombre = nombre;
            if (usuario && usuario !== estudiante.usuario) {
                const existingEstudiante = await estudianteRepository.findOne({ where: { usuario } });
                if (existingEstudiante && existingEstudiante.id !== estudiante.id) {
                    return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
                }
                estudiante.usuario = usuario;
            }
            if (codigo_alumno && codigo_alumno !== estudiante.codigo_alumno) {
                const existingEstudiante = await estudianteRepository.findOne({ where: { codigo_alumno } });
                if (existingEstudiante && existingEstudiante.id !== estudiante.id) {
                    return res.status(400).json({ message: 'El código de alumno ya está en uso.' });
                }
                estudiante.codigo_alumno = codigo_alumno;
            }
            
            if (grado) estudiante.grado = grado;
            if (puntos_recompensa !== undefined) estudiante.puntos_recompensa = puntos_recompensa;
            if (esta_activo !== undefined) estudiante.esta_activo = esta_activo;

            if (maestro_id) {
                const maestro = await maestroRepository.findOne({ where: { id: maestro_id } });
                if (!maestro) {
                    return res.status(400).json({ message: 'El maestro especificado no existe.' });
                }
                estudiante.maestro = maestro;
            }

            await estudianteRepository.save(estudiante);
            res.status(200).json({ message: 'Estudiante actualizado exitosamente.', estudiante });
        } else {
            res.status(403).json({ message: 'Acceso denegado. No tiene permisos para actualizar este estudiante.' });
        }

    } catch (error) {
        console.error(`Error al actualizar estudiante con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el estudiante.' });
    }
};

// Eliminar un estudiante (solo para maestros)
exports.deleteEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const estudiante = await estudianteRepository.findOne({ where: { id } });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        await estudianteRepository.remove(estudiante);
        res.status(200).json({ message: 'Estudiante eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar estudiante con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el estudiante.' });
    }
};

// Login de estudiante
exports.loginEstudiante = async (req, res) => {
    const { codigo_alumno } = req.body;

    try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);

        const estudiante = await estudianteRepository.findOne({ where: { codigo_alumno } });
        if (!estudiante) {
            return res.status(400).json({ message: 'Código de alumno inválido.' });
        }

        if (!estudiante.esta_activo) {
            return res.status(403).json({ message: 'Tu cuenta está inactiva. Contacta a tu maestro.' });
        }

        const payload = {
            id: estudiante.id,
            usuario: estudiante.usuario,
            codigo_alumno: estudiante.codigo_alumno,
            role: 'estudiante'
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            role: payload.role,
            id: estudiante.id,
            nombre: estudiante.nombre,
            usuario: estudiante.usuario,
            codigo_alumno: estudiante.codigo_alumno,
            puntos_recompensa: estudiante.puntos_recompensa,
            grado: estudiante.grado
        });

    } catch (error) {
        console.error('Error al iniciar sesión de estudiante:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');
const Maestro = require('../entities/Maestro');

// Función para iniciar sesión de Maestro
exports.loginMaestro = async (req, res) => {
    const { email, password } = req.body;

    try {
        const maestroRepository = AppDataSource.getRepository(Maestro);

        // Buscar maestro por email
        const maestro = await maestroRepository.findOne({ where: { email } });
        if (!maestro) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, maestro.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const payload = {
            id: maestro.id,
            email: maestro.email,
            role: 'maestro' // Rol fijo para maestros
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            role: payload.role,
            id: maestro.id,
            nombre: maestro.nombre
        });

    } catch (error) {
        console.error('Error al iniciar sesión de maestro:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

// Función para registrar un nuevo Maestro (solo para la configuración inicial o por un super-admin si existiera)
exports.registerMaestro = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const maestroRepository = AppDataSource.getRepository(Maestro);

        // Verificar si el email ya existe
        const existingMaestro = await maestroRepository.findOne({ where: { email } });
        if (existingMaestro) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        // Hashear la contraseña
        const password_hash = await bcrypt.hash(password, 10);

        const nuevoMaestro = maestroRepository.create({
            nombre,
            email,
            password_hash
        });

        await maestroRepository.save(nuevoMaestro);

        res.status(201).json({ message: 'Maestro registrado exitosamente.', maestro: { id: nuevoMaestro.id, nombre: nuevoMaestro.nombre, email: nuevoMaestro.email } });

    } catch (error) {
        console.error('Error al registrar maestro:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar maestro.' });
    }
};

// Función para cerrar sesión (en el lado del servidor, esto es principalmente para invalidar el token si se usa una lista negra)
exports.logoutUser = (req, res) => {
    // Para JWT, el "logout" es principalmente una acción del cliente (eliminar el token).
    // Si se implementa una lista negra de tokens, la lógica iría aquí.
    // Por ahora, simplemente confirmamos que la solicitud de logout fue recibida.
    res.status(200).json({ message: 'Sesión cerrada exitosamente (token debe ser eliminado por el cliente).' });
};

require('dotenv').config();
require("reflect-metadata");
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const AppDataSource = require('./src/config/database');
const Maestro = require('./src/entities/Maestro');
const fs = require('fs').promises; // Importar fs.promises para leer archivos de forma asíncrona

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const estudianteRoutes = require('./src/routes/estudianteRoutes');
const ejercicioRoutes = require('./src/routes/ejercicioRoutes');
const logroRoutes = require('./src/routes/logroRoutes');
const recompensaRoutes = require('./src/routes/recompensaRoutes');
const progresoEstudianteRoutes = require('./src/routes/progresoEstudianteRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/logros', logroRoutes);
app.use('/api/recompensas', recompensaRoutes);
app.use('/api/progreso-estudiantes', progresoEstudianteRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function setupDatabase() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST || "localhost",
            port: DB_PORT ? parseInt(DB_PORT) : 3306,
            user: DB_USER || "root",
            password: DB_PASSWORD || "",
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME || "matematicas_db"}\``);
        console.log(`Base de datos "${DB_NAME || "matematicas_db"}" asegurada.`);
        await connection.end();
    } catch (error) {
        console.error("Error al configurar la base de datos:", error);
        throw error;
    }
}

async function seedDatabase() {
    try {
        const maestroRepository = AppDataSource.getRepository(Maestro);

        // 1. Crear maestro administrador si no existe
        const adminMaestroExists = await maestroRepository.findOne({ where: { email: "admin@matematicas.com" } });
        if (!adminMaestroExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const adminMaestro = maestroRepository.create({
                nombre: "Admin Maestro",
                email: "admin@matematicas.com",
                password_hash: hashedPassword,
            });
            await maestroRepository.save(adminMaestro);
            console.log("Maestro 'admin@matematicas.com' creado.");
        }

        // 2. Insertar logros y recompensas predeterminados desde database.sql
        const sqlFilePath = '../database.sql';
        const sqlContent = await fs.readFile(sqlFilePath, 'utf8');
        const sqlStatements = sqlContent.split(';').filter(statement => statement.trim() !== '');

        for (const statement of sqlStatements) {
            try {
                await AppDataSource.query(statement);
            } catch (err) {
                // Ignorar errores de duplicados si los datos ya existen
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Entrada duplicada, ignorando: ${statement.substring(0, 50)}...`);
                } else {
                    console.error(`Error al ejecutar sentencia SQL: ${statement.substring(0, 50)}...`, err);
                }
            }
        }
        console.log("Logros y recompensas predeterminados insertados/actualizados.");
    } catch (error) {
        console.error("Error en el seeder de la base de datos:", error);
    }
}

async function main() {
    try {
        await setupDatabase();
        await AppDataSource.initialize();
        console.log("Conexión con TypeORM inicializada.");

        await seedDatabase();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

main();
const { DataSource } = require("typeorm");
const path = require('path');

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "matematicas_db",
    synchronize: true, // ¡Cuidado! true solo para desarrollo, sincroniza el esquema.
    logging: false,
    entities: [
        path.join(__dirname, '../entities/**/*.js')
    ],
    migrations: [],
    subscribers: [],
});

module.exports = AppDataSource;

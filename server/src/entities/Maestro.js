
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Maestro",
    tableName: "maestros",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        nombre: {
            type: "varchar"
        },
        email: {
            type: "varchar",
            unique: true
        },
        password_hash: {
            type: "varchar"
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    }
});

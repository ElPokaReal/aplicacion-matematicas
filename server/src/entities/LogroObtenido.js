const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "LogroObtenido",
    tableName: "logros_obtenidos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        fecha_obtencion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        estudiante: {
            target: "Estudiante",
            type: "many-to-one",
            joinColumn: { name: "estudiante_id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        logro: {
            target: "Logro",
            type: "many-to-one",
            joinColumn: { name: "logro_id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }
    }
});
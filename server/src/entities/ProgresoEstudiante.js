
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "ProgresoEstudiante",
    tableName: "progreso_estudiantes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        respuesta_enviada: {
            type: "varchar"
        },
        es_correcta: {
            type: "boolean"
        },
        fecha_intento: {
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
        ejercicio: {
            target: "Ejercicio",
            type: "many-to-one",
            joinColumn: { name: "ejercicio_id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }
    }
});


const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Ejercicio",
    tableName: "ejercicios",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        grado: {
            type: "int"
        },
        tipo_operacion: {
            type: "varchar"
        },
        pregunta: {
            type: "text"
        },
        respuesta_correcta: {
            type: "varchar"
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        creado_por_maestro: {
            target: "Maestro",
            type: "many-to-one",
            joinColumn: { name: "creado_por_maestro_id" },
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }
    }
});

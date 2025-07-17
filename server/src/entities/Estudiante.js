
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Estudiante",
    tableName: "estudiantes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        nombre: {
            type: "varchar"
        },
        usuario: {
            type: "varchar",
            unique: true
        },
        codigo_alumno: {
            type: "varchar",
            unique: true,
            nullable: true // Allow null initially if not all students will have it immediately
        },
        
        grado: {
            type: "varchar"
        },
        puntos_recompensa: {
            type: "int",
            default: 0
        },
        esta_activo: {
            type: "boolean",
            default: true
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        maestro: {
            target: "Maestro",
            type: "many-to-one",
            joinColumn: { name: "maestro_id" },
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }
    }
});

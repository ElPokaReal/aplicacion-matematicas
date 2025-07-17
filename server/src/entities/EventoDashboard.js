const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "EventoDashboard",
    tableName: "eventos_dashboard",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        tipo: {
            type: "varchar"
        },
        descripcion: {
            type: "varchar"
        },
        grado: {
            type: "int",
            nullable: true
        },
        fecha: {
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
        }
    }
}); 
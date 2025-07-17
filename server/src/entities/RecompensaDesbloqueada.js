const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "RecompensaDesbloqueada",
    tableName: "recompensas_desbloqueadas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        fecha_desbloqueo: {
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
        recompensa: {
            target: "Recompensa",
            type: "many-to-one",
            joinColumn: { name: "recompensa_id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }
    }
});
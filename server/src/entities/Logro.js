const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Logro",
    tableName: "logros",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        nombre: {
            type: "varchar",
            unique: true
        },
        descripcion: {
            type: "varchar"
        },
        tipo_logro: {
            type: "varchar", // Ej: 'puntos', 'ejercicios_completados', 'racha'
        },
        valor_requerido: {
            type: "int",
        },
        puntos_otorgados: {
            type: "int",
            nullable: true
        },
        icono_url: {
            type: "varchar",
            nullable: true
        },
        criterio_adicional: {
            type: "varchar",
            nullable: true
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    }
});
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Recompensa",
    tableName: "recompensas",
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
        costo_puntos: {
            type: "int"
        },
        url_imagen: {
            type: "varchar",
            nullable: true
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    }
});
import { Model, DataTypes } from "sequelize";

class Tipo extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: "Tipo",
                tableName: "tipos"
            }
        );
    }

    static associate(models) {
    
    }
}

export { Tipo };
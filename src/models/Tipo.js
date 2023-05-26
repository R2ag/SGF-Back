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
                modelName: "tipo",
                tableName: "tipos"
            }
        );
    }

    static associate(models) {
    
    }
}

export { Tipo };
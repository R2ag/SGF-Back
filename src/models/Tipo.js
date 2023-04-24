import { Model, DataType, DataTypes } from "sequelize";

class Tipo extends Model{
    static init (sequelize){
        super.init({
            nome:{
                type: DataTypes.STRING,
                validate:{
                    notEmpty, notNull
                }
            }
        })
    }
    static associate(models) {

    }
}

export {Tipo}
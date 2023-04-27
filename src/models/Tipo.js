import { Model, DataTypes } from "sequelize";

class Tipo extends Model{
    static init (sequelize){
        super.init({
            nome:{
                type: DataTypes.STRING,
                allowNull:false
            }
        })
    }
    static associate(models) {

    }
}

export {Tipo}
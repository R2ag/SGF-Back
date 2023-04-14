//Rafael

import { Model, DataTypes } from "sequelize";

class Favorecido extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Favorecido deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Favorecido deve ter entre 2 e 50 letras!" }
                }
            },
            ramo: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Ramo do Favorecido deve ser preenchido!" },
                    len: { args: [2, 20], msg: "Ramo do Favorecido deve ter entre 2 e 20 letras!" }
                }
            },
            cpfOuCnpj: {
                type: DataTypes.STRING,
                validate: {
                    len:{
                        args: [
                            [11,11],
                            [14,14]
                        ],
                        msg: "O Cpf deve ter 11 caracteres e o cnpj deve ter 14 caracteres"
                    },
                    isNumeric: true, msg:"Digite apenas os numeros" 
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                    notEmpty: { msg: "O email deve ser preenchido!" },
                }
            }
        }, { sequelize, modelName: 'favorecido', tableName: 'favorecidos' })
    }

    static associate(models) {

    }
}

export { Favorecido };
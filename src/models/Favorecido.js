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
                    isCpfOrCnpj(value) {
                        const regex = /^(?:(\d{3})\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
                        if (!regex.test(value)) {
                            throw new Error('O campo documento deve ser um CPF ou CNPJ válido');
                        }
                    }
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
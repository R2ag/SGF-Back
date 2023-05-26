//Rafael

import { Model, DataTypes } from "sequelize";

class Favorecido extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "O nome do favorecido deve ser preenchido!" },
                    len: { args: [2, 50], msg: "O nome do favorecido deve ter entre 2 e 50 caracteres!" }
                }
            },
            ramo: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "O ramo do favorecido deve ser preenchido!" },
                    len: { args: [2, 20], msg: "O ramo do favorecido deve ter entre 2 e 20 caracteres!" }
                }
            },
            cpf_cnpj: {
                type: DataTypes.STRING,
                validate: {
                    isCpfOrCnpj(value) {
                        const regex = /^(?:(\d{3})\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
                        if (!regex.test(value)) {
                            throw new Error("O campo documento deve ser um CPF ou CNPJ válido");
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
        }, { 
            sequelize,
            modelName: "favorecido",
            tableName: "favorecidos"
        });
    }

    static associate(models) {

    }
}

export { Favorecido };
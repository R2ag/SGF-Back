//Teognes

import { Model, DataTypes } from "sequelize";

class Usuario extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: { msg: "Nome do usuário deve ser preenchido!" },
                        len: { args: [2, 50], msg: "Nome do usuário deve ter entre 2 e 50 letras!" },
                    },
                },
                cpf: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: { msg: "CPF do usuário deve ser preenchido!" },
                        isCpf(value) {
                            const cpfRegex = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/;
                            if (!cpfRegex.test(value)) {
                                throw new Error("O campo CPF deve ser um CPF válido");
                            }
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    validate: {
                        isEmail: { msg: "O email deve ser preenchido com um endereço de email válido!" },
                        notEmpty: { msg: "O email deve ser preenchido!" },
                    },
                },
                usuario: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: { msg: "O usuário deve ser preenchido!" },
                        len: { args: [4, 15], msg: "O usuário deve ter entre 4 e 15 caracteres!" },
                    },
                },
                senha: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: { msg: "A senha deve ser preenchida!" },
                        len: { args: [6, 20], msg: "A senha deve ter entre 6 e 20 caracteres!" },
                    },
                },
            },
            { sequelize, modelName: "Usuario", tableName: "usuarios" }
        );
    }

    static associate(models) {

    }
}

export { Usuario };
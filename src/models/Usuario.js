import { Model, DataTypes } from "sequelize";

class Usuario extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Usuário deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Usuário deve ter entre 2 e 50 letras!" }
                }
            },
            cpf: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "CPF do Usuário deve ser preenchido!" },
                    is: { args: ["[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}"], msg: "CPF do Usuário deve seguir o padrão NNN.NNN.NNN-NN!" },
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                    notEmpty: { msg: "O email deve ser preenchido!" },
                }
            },
            usuario: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "O Usuário deve ser preenchido!" },
                    len: { args: [4, 15], msg: "O Usuário deve ter entre 4 e 15 caracteres!" }
                }
            },
            senha: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "A Senha deve ser preenchida!" },
                    len: { args: [6, 20], msg: "A Senha deve ter entre 6 e 20 caracteres!" }
                }
            }
        }, { sequelize, modelName: 'usuario', tableName: 'usuarios' })
    }

    static associate(models) {

    }
}

export { Usuario };
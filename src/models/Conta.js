//Rafael

import { Model, DataTypes } from "sequelize";

class Conta extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome da Conta deve ser preenchido!" },
                    len: { args: [2, 30], msg: "Nome da Conta deve ter entre 2 e 30 caracteres!" }
                }
            },
            tipo: {
                type: DataTypes.STRING,
                validate: {
                    len: { args: [2, 20], msg: "O tipo deve ter entre 2 e 20 caracteres!" }
                }
            },
            descricao: {
                type: DataTypes.STRING,
                validate: {
                    len: { args: [0, 50], msg: "A descrição deve ter no maximo 50 caracteres!" }
                }
            },
            saldo: {
                type: DataTypes.DOUBLE,
                validate: {
                    isFloat: { msg: "O saldo deve ser preenchido com um valor decimal!" }
                }
            }
        }, { sequelize, modelName: 'conta', tableName: 'contas' })
    }

    static associate(models) {
        this.belongsTo(models.usuario, { as: 'usuario', foreignKey: { name: 'usuarioId', allowNull: false, validate: { notNull: { msg: 'O Usuário deve ser preenchido!' } } } });
    }
}

export { Conta };
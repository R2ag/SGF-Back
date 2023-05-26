//Rafael

import { Model, DataTypes } from "sequelize";

class Conta extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: { msg: "O nome da conta deve ser preenchido!" },
                        len: { args: [2, 30], msg: "O nome da conta deve ter entre 2 e 30 caracteres!" }
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
                        len: { args: [0, 50], msg: "A descrição deve ter no máximo 50 caracteres!" }
                    }
                },
                saldo: {
                    type: DataTypes.DOUBLE,
                    validate: {
                        isFloat: { msg: "O saldo deve ser preenchido com um valor decimal!" }
                    }
                }
            },
            { 
                sequelize,
                modelName: "Conta",
                tableName: "contas"
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Usuario, {
            as: "usuario",
            foreignKey: {
                name: "usuarioId",
                allowNull: false,
                validate: {
                    notNull: { msg: "O usuário deve ser preenchido!" }
                }
            }
        });
    }
}

export { Conta };
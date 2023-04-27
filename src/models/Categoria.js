//Teognes

import { Model, DataTypes } from "sequelize";

class Categoria extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome da Categoria deve ser preenchida!" },
                    len: { args: [2, 30], msg: "Nome da Categoria deve ter entre 2 e 30 caracteres!" }
                }
            },
            descricao: {
                type: DataTypes.STRING,
                validate: {
                    len: { args: [0, 50], msg: "A descrição deve ter no maximo 50 caracteres!" }
                }
            },
            observacao: {
                type: DataTypes.STRING,
                validate: {
                    len: { args: [0, 50], msg: "A descrição deve ter no maximo 50 caracteres!" }
                }
            }
        }, { sequelize, modelName: 'categoria', tableName: 'categorias' })
    }

    static associate(models) {
        this.belongsTo(models.tipo, {as: 'tipo', foreignKey: {name: 'tipoId', allowNull: false, validate: {notNull: {msg: 'O Tipo da Categoria deve ser informado.'}}}});
    }
}

export { Categoria };
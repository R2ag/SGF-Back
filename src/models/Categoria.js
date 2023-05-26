//Teognes

import { Model, DataTypes } from "sequelize";

class Categoria extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: { msg: "O nome da categoria deve ser preenchido!" },
                        len: { args: [2, 30], msg: "O nome da categoria deve ter entre 2 e 30 caracteres!" },
                    },
                },
                descricao: {
                    type: DataTypes.STRING,
                    validate: {
                        len: { args: [0, 50], msg: "A descrição deve ter no máximo 50 caracteres!" },
                    },
                },
                observacao: {
                    type: DataTypes.STRING,
                    validate: {
                        len: { args: [0, 50], msg: "A observação deve ter no máximo 50 caracteres!" },
                    },
                },
            },
            { 
                sequelize,
                modelName: "categoria",
                tableName: "categorias"
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.tipo, {
            as: "tipo",
            foreignKey: {
                name: "tipo_id",
                allowNull: false,
                validate: {
                    notNull: { msg: "O tipo da categoria deve ser informado." }
                }
            }
        });
    }
}

export { Categoria };
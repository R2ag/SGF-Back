//Rafael

import { Model, DataTypes } from "sequelize";

class Transacao extends Model {
    static init(sequelize) {
        super.init(
            {
                data: {
                    type: DataTypes.DATEONLY,
                    validate: {
                        isDate: { msg: "A data deve ser preenchida no formato yyyy-MM-dd!" },
                    },
                },
                descricao: {
                    type: DataTypes.STRING,
                    validate: {
                        len: { args: [0, 50], msg: "A descrição deve ter no máximo 50 caracteres!" },
                    },
                },
                valor: {
                    type: DataTypes.DOUBLE,
                    validate: {
                        isFloat: { msg: "O valor deve ser preenchido com um valor decimal!" },
                    },
                },
            },
            { 
                sequelize, 
                modelName: "transacao", 
                tableName: "transacoes" 
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.conta, { 
            as: "conta",
            foreignKey: {
                name: "contaId",
                allowNull: false,
                validate: {
                    notNull: { msg: "A conta do usuário deve ser preenchida!" } 
                } 
            } 
        });
        this.belongsTo(models.tipo, { 
            as: "tipo",
            foreignKey: {
                name: "tipoId",
                allowNull: false,
                validate: {
                    notNull: { msg: "O tipo da transação deve ser informado!" } 
                } 
            } 
        });
        this.belongsTo(models.favorecido, {
            as: "favorecido",
            foreignKey: {
                name: "favorecidoId",
                allowNull: false,
                validate: {
                    notNull: { msg: "O favorecido deve ser preenchido!" } 
                } 
            } 
        });
        this.belongsTo(models.categoria, {
            as: "categoria",
            foreignKey: {
                name: "categoriaId", 
                allowNull: false, 
                validate: { 
                    notNull: { msg: "A categoria deve ser preenchida!" } 
                } 
            } 
        });
    }
}

export { Transacao };
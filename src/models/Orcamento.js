//Teognes

import { Model, DataTypes } from "sequelize";

class Orcamento extends Model {
    static init(sequelize) {
        super.init(
            {
                dataInicio: {
                    type: DataTypes.DATEONLY,
                    validate: {
                        isDate: { msg: "A data deve ser preenchida no formato yyyy-MM-dd!" },
                    },
                },
                dataFinal: {
                    type: DataTypes.DATEONLY,
                    validate: {
                        isDate: { msg: "A data deve ser preenchida no formato yyyy-MM-dd!" },
                    },
                },
                valorTotal: {
                    type: DataTypes.DOUBLE,
                    validate: {
                        isFloat: { msg: "O valor deve ser preenchido com um valor decimal!" },
                    },
                },
            },
            {
                sequelize, 
                modelName: "orcamento", 
                tableName: "orcamentos" 
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.usuario, { 
            as: "usuario", 
            foreignKey: { 
                name: "usuarioId", 
                allowNull: false, 
                validate: { 
                    notNull: { msg: "O Usuário deve ser preenchido!" } 
                } 
            } 
        });
        this.hasMany(models.orcamentocategoria, { 
            as: { 
                singular: 'orcamentoCategoria', 
                plural: 'orcamentosCategorias' 
            }, 
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE' 
        });
    }
}

export { Orcamento };
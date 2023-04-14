import { Model, DataTypes } from "sequelize";

class OrcamentoCategoria extends Model {
    static init(sequelize) {
        super.init({
            descricao: {
                type: DataTypes.STRING,
                validate: {
                    len: { args: [0, 50], msg: "A descrição deve ter entre 2 e 50 caracteres!" }
                }
            },
            valor: {
                type: DataTypes.DOUBLE,
                validate: {
                    isFloat: { msg: "O valor deve ser preenchido com um valor decimal!" }
                }
            }
        }, { sequelize, modelName: 'orcamentoCategoria', tableName: 'orcamentosCategorias' })
    }

    static associate(models) {
        this.removeAttribute('id');
        this.belongsTo(models.usuario, { as: 'categoria', foreignKey: { name: 'categoriaId', primarykey:true, allowNull: false, validate: { notNull: { msg: 'A Categoria deve ser preenchida!' } } } });
        this.belongsTo(models.usuario, { as: 'orcamento', foreignKey: { name: 'orcamentoId', primarykey:true, allowNull: false, validate: { notNull: { msg: 'O Orcamento deve ser preenchido!' } } } });
    }
}

export { OrcamentoCategoria };
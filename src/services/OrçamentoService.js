import { QueryTypes, Sequelize } from "sequelize";
import { Orcamento } from "../models/Orcamento";

class OrcamentoService{
    static async findAll(){
        const objs = await Orcamento.findAll({include: {all: true, nested: true}});
        return objs;
    }

    static async findByPk(req){
        const {id} = req.params;
        const obj = await Orcamento.findByPk(id, {include: {all: true, nested: true}});
        return obj;
    }

    static async FindByPeriodAndCategory(data, categoriaId, transaction){
        orcamentoId = await Sequelize.query(
            "SELECT id FROM orcamentos JOIN orcamentosCategorias ON orcamentos.id = orcamentosCategorias.orcamentoId WHERE dataInicio <= :data AND dataFinal >= :data AND orcamentosCategorias.categoriaId = :categoriaId",
            {replacements: {data: data, categoriaId: categoriaId}, type: QueryTypes.SELECT}
        );

    }
}
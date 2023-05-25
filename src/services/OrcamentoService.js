import { QueryTypes, Sequelize } from "sequelize";
import { Orcamento } from "../models/Orcamento";
import { OrcamentoCategoria } from "../models/OrcamentoCategoria";

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

    static async findByPeriodAndCategory(data, categoriaId){
        const orcamentoId = await Sequelize.query(
            "SELECT id FROM orcamentos JOIN orcamentosCategorias ON orcamentos.id = orcamentosCategorias.orcamentoId WHERE dataInicio <= :data AND dataFinal >= :data AND orcamentosCategorias.categoriaId = :categoriaId",
            {replacements: {data: data, categoriaId: categoriaId}, type: QueryTypes.SELECT}
        );
        
        return orcamentoId;
    }

    static async atualizarValorUtilizado(idOrcamento, idCategoria, valorTransacao, transaction){
        try{
            const orcamentoCategoria = await OrcamentoCategoria.findOne({
                where:{
                    orcamentoId: idOrcamento,
                    categoriaId: idCategoria
                }
            });

            if (!orcamentoCategoria) {
                throw new Error('Não foi possivel localiza a cetegoria no lançamento!');
                
            }

            orcamentoCategoria.valorUtilizado +=  valorTransacao;

            await orcamentoCategoria.save(transaction);

            return orcamentoCategoria;
        }catch(error){
            throw error;
        }

    }
}

export {OrcamentoService};
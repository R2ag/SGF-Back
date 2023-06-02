import Sequelize, { QueryTypes } from "sequelize";
import { Orcamento } from "../models/Orcamento.js";
import { OrcamentoCategoria } from "../models/OrcamentoCategoria.js";

class OrcamentoService {
    static async findAll() {
        try {
            const objs = await Orcamento.findAll({ include: { all: true, nested: true } });
            return objs;
        } catch (error) {
            console.error("Erro ao buscar todos os orçamentos:", error);
            throw error;
        }
    }

    static async findByPk(req) {
        try {
            const { id } = req.params;
            const obj = await Orcamento.findByPk(id, { include: { all: true, nested: true } });
            return obj;
        } catch (error) {
            console.error("Erro ao buscar orçamento por ID:", error);
            throw error;
        }
    }

    static async findByPeriodAndCategory(data, categoriaId) {
        try {
            const orcamentoId = await Orcamento.sequelize.query(
                "SELECT orcamentos.id FROM orcamentos JOIN orcamentoscategorias ON orcamentos.id = orcamentoscategorias.orcamento_id WHERE orcamentos.data_inicio <= :data AND orcamentos.data_final >= :data AND orcamentoscategorias.categoria_id = :categoria_id",
                { replacements: { data: data, categoria_id: categoriaId }, type: Sequelize.QueryTypes.SELECT }
            );

            return orcamentoId;
        } catch (error) {
            console.error("Erro ao buscar orçamento por período e categoria:", error);
            throw error;
        }
    }

    static async atualizarValorUtilizado(idOrcamento, idCategoria, valorTransacao, transaction) {
        try {
            const orcamentoCategoria = await OrcamentoCategoria.findOne({
                where: {
                    orcamento_id: idOrcamento,
                    categoria_id: idCategoria
                }
            });

            if (!orcamentoCategoria) {
                throw new Error('Categoria de orçamento não encontrada!');
            }

            orcamentoCategoria.valorUtilizado += valorTransacao;
            await orcamentoCategoria.save(transaction);

            return (orcamentoCategoria.valor - orcamentoCategoria.valorUtilizado);
        } catch (error) {
            console.error("Erro ao atualizar valor utilizado do orçamento:", error);
            throw error;
        }
    }

    static async findGraficoOfValoresOrcadosETransacionadosByOrcamento(req){
        const { id } = req.params;
        const objs = await Orcamento.sequelize.query(`
            SELECT
                categorias.nome AS 'Categoria',
                orcamentoscategorias.valor AS 'Valor Orçado',
                orcamentoscategorias.valor_utilizado AS 'Valor Utilizado'
            FROM 
                orcamentos
                JOIN orcamentoscategorias ON orcamento.id = orcamentoscategorias.orcamento_id
                JOIN categorias ON orcamentoscategorias.categoria_id = categoria.id
            WHERE
                orcamentos.id = :id
        `, {replacements: {id: id}, type: QueryTypes.SELECT});

        return objs;
    }
}

export { OrcamentoService };
import Sequelize from "sequelize";
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
}

export { OrcamentoService };
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

    static async create(req) {
        try {
            const { dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias } = req.body;

            if (!orcamentosCategorias || orcamentosCategorias.length === 0) {
                throw new Error("É necessário fornecer pelo menos uma categoria para o orçamento.");
            }

            const orcamento = await Orcamento.create({
                dataInicio,
                dataFinal,
                valorTotal,
                usuarioId,
            });

            for (const orcamentoCategoriaData of orcamentosCategorias) {
                const { descricao, valor, categoriaId } = orcamentoCategoriaData;

                await OrcamentoCategoria.create({
                    descricao,
                    valor,
                    orcamentoId: orcamento.id,
                    categoriaId,
                });
            }

            return orcamento;
        } catch (error) {
            throw new Error("Erro ao criar o orçamento. Verifique os dados fornecidos.");
        }
    }

    static async update(req) {
        const { id } = req.params;
        const { dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias } = req.body;

        const orcamento = await Orcamento.findByPk(id);

        if (!orcamento) {
            throw new Error("Orcamento não encontrado");
        }

        orcamento.dataInicio = dataInicio;
        orcamento.dataFinal = dataFinal;
        orcamento.valorTotal = valorTotal;
        orcamento.usuarioId = usuarioId;

        await orcamento.save();

        if (orcamentosCategorias && orcamentosCategorias.length > 0) {
            await orcamento.setOrcamentosCategorias([]);

            for (const orcamentoCategoriaData of orcamentosCategorias) {
                const { descricao, valor, categoriaId } = orcamentoCategoriaData;

                await OrcamentoCategoria.create({
                    descricao,
                    valor,
                    orcamentoId: orcamento.id,
                    categoriaId,
                });
            }
        }

        return orcamento;
    }

    static async delete(req) {
        const { id } = req.params;

        const orcamento = await Orcamento.findByPk(id);

        if (!orcamento) {
            throw new Error("Orcamento não encontrado");
        }

        await orcamento.destroy();

        return orcamento;
    }

    //Regra de negocio, o sistema consulta no banco as categorias utilizadas no Orçamento anterior e as sugere ao usuário
    static async findByUsuario(req) {
        try {
            const { usuarioId } = req.params;
            const objs = await Orcamento.findAll({
                where: { usuarioId: usuarioId }, include: [{ model: OrcamentoCategoria, as: 'orcamentosCategorias', attributes: ['descricao', 'valor', 'categoriaId'] }]
            });

            if (objs.length === 0) {
                throw new Error("Nenhuma categoria encontrada para o usuário especificado.");
            }

            return objs.map(obj => obj.orcamentosCategorias);
        } catch (error) {
            throw new Error("Erro ao buscar as categorias pelo usuário especificado.");
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
                orcamentoId: idOrcamento,
                categoriaId: idCategoria
            }
        });

        if (!orcamentoCategoria) {
            throw new Error('Categoria de orçamento não encontrada!');
        }

        orcamentoCategoria.valorUtilizado += valorTransacao;
        await orcamentoCategoria.save(transaction);
        const valorDisponivel = orcamentoCategoria.valor - orcamentoCategoria.valorUtilizado; 
        return valorDisponivel;
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
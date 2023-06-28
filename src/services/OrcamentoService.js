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

    static async create(orcamentoDTO) {
        try {
            const { dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias } = orcamentoDTO;

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

    static async update(req, orcamentoDTO) {
        const { id } = req.params;
        const { dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias } = orcamentoDTO;

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
            const selectedOrcamentoCategoria = await OrcamentoCategoria.findOne({
                where: {
                    orcamentoId: idOrcamento,
                    categoriaId: idCategoria
                }
            });

            if (!selectedOrcamentoCategoria) {
                throw new Error('Categoria de orçamento não encontrada!');
            }

            await selectedOrcamentoCategoria.increment('valorUtilizado',{by: (valorTransacao * -1), transaction});
            await selectedOrcamentoCategoria.save(transaction);

            const valorDisponivel = selectedOrcamentoCategoria.valor - selectedOrcamentoCategoria.valorUtilizado;
            return valorDisponivel;
        } catch (error) {
            console.error("Erro ao atualizar valor utilizado do orçamento:", error);
            throw error;
        }
    }

    // Relatorio que vai listar as categorias e comparar o valor orçado com o valor utilizado

    static async findGraficoOfValoresOrcadosETransacionadosByOrcamento(req) {
        const { id } = req.params;
        const objs = await Orcamento.sequelize.query(`
            SELECT
                categorias.nome AS 'Categoria',
                orcamentoscategorias.valor AS 'Valor Orçado',
                orcamentoscategorias.valor_utilizado AS 'Valor Utilizado'
            FROM 
                orcamentos
                JOIN orcamentoscategorias ON orcamentos.id = orcamentoscategorias.orcamento_id
                JOIN categorias ON orcamentoscategorias.categoria_id = categorias.id
            WHERE
                orcamentos.id = :id
        `, { replacements: { id: id }, type: QueryTypes.SELECT });

        return objs;
    }

    //relatorio de categorias, representando o valor relativo de cada categoria orçada do usuario em relação ao total orçado no período desejado a ser pesquisado por porcentagem

    static async findGraficoOfDivisaoDoTotalOrcadoByOrcamento(req) {
        const { usuarioId, dataInicio, dataFinal } = req.params;
        const objs = await Orcamento.sequelize.query(`
            SELECT 
                oc.categoria_id AS categoriaId, 
                c.nome AS Nome, 
                SUM(oc.valor) AS totalGasto 
            FROM 
                orcamentos o 
                JOIN orcamentoscategorias oc ON o.id = oc.orcamento_id 
                JOIN categorias c ON oc.categoria_id = c.id 
            WHERE 
                o.usuario_id = :usuario_id 
                AND o.data_inicio >= :data_inicio 
                AND o.data_final <= :data_final 
            GROUP BY 
                oc.categoria_id, 
                c.nome
        `, { replacements: { usuario_id: usuarioId, data_inicio: dataInicio, data_final: dataFinal }, type: QueryTypes.SELECT });

        // Calcula a soma de todos os valores obtidos
        const totalGasto = objs.reduce((sum, obj) => sum + obj.totalGasto, 0);

        // Calcula o valor percentual para cada objeto e substitui o totalGasto
        objs.forEach(obj => {
            obj.totalGasto = (obj.totalGasto / totalGasto) * 100;
        });

        return objs;
    }

}

export { OrcamentoService };
import { Transacao } from "../models/Transacao.js";
import { ContaService } from "./ContaService.js";
import { OrcamentoService } from "./OrcamentoService.js";
import { MessageResponseDTO } from "../dto/response/MessageResponseDTO.js";
import { QueryTypes } from 'sequelize';

class TransacaoService {
    static async findAll() {
        try {
            const objs = await Transacao.findAll({ include: { all: true, nested: true } });
            return objs;
        } catch (error) {
            console.error("Erro ao buscar todas as transações:", error);
            throw error;
        }
    }

    static async findByPk(id) {
        try {
            const obj = await Transacao.findByPk(id, { include: { all: true, nested: true } });
            return obj;
        } catch (error) {
            console.error("Erro ao buscar transação por ID:", error);
            throw error;
        }
    }

    static async create(transacaoDTO) {
        try {
            const { data, descricao, valor, contaId, categoriaId, favorecidoId, tipoId } = transacaoDTO;
            const t = await Transacao.sequelize.transaction();

            try {
                const obj = await Transacao.create(
                    {
                        data,
                        descricao,
                        valor,
                        contaId,
                        categoriaId,
                        favorecidoId,
                        tipoId
                    },
                    { transaction: t }
                );

                const objCriado = await Transacao.findByPk(obj.id, { include: { all: true, nested: true }, transaction: t });

                const messageResponse = new MessageResponseDTO(await this.regrasDeNegocio(objCriado, t));

                await t.commit();

                return messageResponse;
            } catch (error) {
                await t.rollback();
                throw new Error("Erro ao criar a Transação: " + error.message);
            }
        } catch (error) {
            console.error("Erro ao criar transação:", error);
            throw error;
        }
    }

    static async update(id, transacaoDTO) {
        try {

            const t = await Transacao.sequelize.transaction();

            const { data, descricao, valor, contaId, categoriaId, favorecidoId } = transacaoDTO;

            const savedTransacao = await Transacao.findByPk(id);

            let mensagem = '';

            if (savedTransacao.contaId != contaId) {
                await ContaService.atualizarSaldo(savedTransacao.contaId, (savedTransacao.valor * (-1)), t);
                await ContaService.atualizarSaldo(contaId, valor, t);
            } else {
                if (savedTransacao.valor != valor) {
                    const diferencaValores = valor - savedTransacao.valor;

                    await ContaService.atualizarSaldo(savedTransacao.contaId, diferencaValores, t);
                }
            }

            if (savedTransacao.categoriaId != categoriaId || savedTransacao.data != data) {
                const mensagem1 = await this.atualizarOrcamentos(savedTransacao.data, savedTransacao.categoriaId, (savedTransacao.valor * (-1)), t);
                const mensagem2 = await this.atualizarOrcamentos(data, categoriaId, Math.abs(valor), t);

                mensagem = mensagem.concat(mensagem1);
                mensagem = mensagem.concat(mensagem2);
            } else {
                if (savedTransacao.valor != valor) {
                    const diferencaValores = valor - savedTransacao.valor;

                    const mensagem3 = await this.atualizarOrcamentos(data, categoriaId, diferencaValores, t);
                    mensagem = mensagem.concat(mensagem3);
                }
            }

            Object.assign(savedTransacao, {
                data,
                descricao,
                valor,
                contaId,
                categoriaId,
                favorecidoId
            })
            await savedTransacao.save(t);

            let messageResponse;

            if (mensagem != '') {
                messageResponse = new MessageResponseDTO(mensagem);
            } else {
                messageResponse = new MessageResponseDTO("Transação atualizada com sucesso!");
            }
            await t.commit();

            return messageResponse;

        } catch (error) {
            console.error("Erro ao atualizar a transação", error);
            throw error;
        }

    }

    static async delete(id) {
        try {
            const t = await Transacao.sequelize.transaction();

            const savedTransacao = await Transacao.findByPk(id);

            if (savedTransacao == null) throw 'Transação não encontrada';

            await ContaService.atualizarSaldo(savedTransacao.contaId, (savedTransacao.valor * (-1)), t);
            await this.atualizarOrcamentos(savedTransacao.data, savedTransacao.categoriaId, (savedTransacao.valor * (-1)), t);

            await savedTransacao.destroy(t);

            t.commit();

            return savedTransacao;
        } catch (error) {
            console.error("Erro ao excluir a transação", error);
            throw error;
        }
    }


    //REGRAS DE NEGÓCIO
    static async regrasDeNegocio(selectedTransacao, transaction) {
        try {
            // Atualiza o saldo na conta
            await ContaService.atualizarSaldo(selectedTransacao.contaId, selectedTransacao.valor, transaction);

            const mensagem = await this.atualizarOrcamentos(selectedTransacao.data, selectedTransacao.categoriaId, Math.abs(selectedTransacao.valor), transaction);

            return mensagem;
        } catch (error) {
            console.error("Erro ao aplicar regras de negócio da transação:", error);
            throw error;
        }
    }

    static async atualizarOrcamentos(dataTransacao, categoriaTransacao, valorTransacao, transaction) {
        // Verificar se existe orçamento
        const orcamentosId = await OrcamentoService.findByPeriodAndCategory(dataTransacao, categoriaTransacao);

        // Se existir orçamento: Atualizar valor disponível
        if (orcamentosId.length > 0) {
            let mensagem = '';
            await Promise.all(orcamentosId.map(async (orcamento) => {
                const orcamentoId = orcamento.id; // Acessando corretamente o valor do orcamentoId
                const limiteDisponivel = await OrcamentoService.atualizarValorUtilizado(
                    orcamentoId,
                    categoriaTransacao,
                    valorTransacao,
                    transaction
                );
                mensagem = mensagem.concat(`Você ainda pode utilizar R$ ${limiteDisponivel} para essa categoria no orçamento ${orcamentoId}. `);
            }));

            return mensagem;
        }

        // Retornar mensagem de que não existe orçamento cadastrado para o período e categoria
        return "Não existe orçamento cadastrado para o período e categoria!";

    }



    //RELATÓRIOS

    static async fyndByCategoriaEPeriodo(idCategoria, dataInicial, dataFinal) {
        const objs = await Transacao.sequelize.query(`
            SELECT
                transacoes.data AS "Data",
                transacoes.valor AS "Valor",
                contas.nome AS "Conta",
                favorecidos.nome AS "Favorecido",
                transacoes.descricao AS "Descricao"
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                JOIN contas ON transacoes.conta_id = contas.id
                JOIN favorecidos ON transacoes.favorecido_id = favorecidos.id
            WHERE
                categorias.id = :categoria AND 
                transacoes.data >= :data_inicial AND 
                transacoes.data <= :data_final
        `, { replacements: { categoria: idCategoria, data_inicial: dataInicial, data_final: dataFinal }, type: QueryTypes.SELECT });

        return objs;
    }

    static async fyndByContaEPeriodo(idConta, dataInicial, dataFinal) {
        const objs = await Transacao.sequelize.query(`
            SELECT
                transacoes.data AS "Data",
                transacoes.valor AS "Valor",
                categorias.nome AS "Categoria",
                favorecidos.nome AS "Favorecido",
                transacoes.descricao AS "Descricao"
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                JOIN contas ON transacoes.conta_id = contas.id
                JOIN favorecidos ON transacoes.favorecido_id = favorecidos.id
            WHERE
                contas.id = :conta AND 
                transacoes.data >= :data_inicial AND 
                transacoes.data <= :data_final
        `, { replacements: { conta: idConta, data_inicial: dataInicial, data_final: dataFinal }, type: QueryTypes.SELECT});

        return objs;
    }


    static async fyndByFavorecidoEPeriodo(idFavorecido, dataInicial, dataFinal ) {
        const objs = await Transacao.sequelize.query(`
            SELECT
                transacoes.data AS "Data",
                transacoes.valor AS "Valor",
                categorias.nome AS "Categoria",
                contas.nome AS "Conta",
                transacoes.descricao AS "Descricao"
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                JOIN contas ON transacoes.conta_id = contas.id
                JOIN favorecidos ON transacoes.favorecido_id = favorecidos.id
            WHERE
                favorecidos.id = :favorecido AND 
                transacoes.data >= :data_inicial AND 
                transacoes.data <= :data_final
        `, { replacements: { favorecido: idFavorecido, data_inicial: dataInicial, data_final: dataFinal }, type: QueryTypes.SELECT});

        return objs;
    }

    static async listByCategoriaEPeriodo(dataInicial, dataFinal) {
        const objs = await Transacao.sequelize.query(`
            SELECT
                contas.nome AS "Conta",
                SUM(transacoes.valor) AS "Valor"
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                JOIN contas ON transacoes.conta_id = contas.id
            WHERE 
                transacoes.data >= :data_inicial AND 
                transacoes.data <= :data_final
            GROUP BY
                contas.nome
        `, { replacements: { data_inicial: dataInicial, data_final: dataFinal }, type: QueryTypes.SELECT });

        return objs;
    }


}

export { TransacaoService };

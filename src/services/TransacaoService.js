import { Transacao } from "../models/Transacao.js";
import { ContaService } from "./ContaService.js";
import { OrcamentoService } from "./OrcamentoService.js";
import { MessageResponseDTO } from "../dto/response/MessageResponseDTO.js";

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

    static async findByPk(req) {
        try {
            const { id } = req.params;
            const obj = await Transacao.findByPk(id, { include: { all: true, nested: true } });
            return obj;
        } catch (error) {
            console.error("Erro ao buscar transação por ID:", error);
            throw error;
        }
    }

    static async create(req) {
        try {
            const { data, descricao, valor, conta, categoria, favorecido } = req.body;

            if (conta == null) {
                throw new Error('A conta utilizada nessa transação deve ser informada');
            }
            if (categoria == null) {
                throw new Error('A categoria a qual essa transação pertence deve ser informada');
            }
            if (favorecido == null) {
                throw new Error('Deve ser informado o participante dessa transação');
            }

            // Normaliza o valor recebido
            const valorNormalizado = Math.abs(valor);

            const t = await Transacao.sequelize.transaction();

            try {
                const obj = await Transacao.create(
                    {
                        data,
                        descricao,
                        valor: valorNormalizado,
                        conta_id: conta.id,
                        categoria_id: categoria.id,
                        favorecido_id: favorecido.id
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

    static async update(req){
        try {
            const { id } = req.params;
            const { data, descricao, valor, conta, categoria, favorecido } = req.body;
        } catch (error) {
            console.error("Erro ao atualizar a transação", error);
            throw error;
        }

    }

    static async regrasDeNegocio(obj, transaction) {
        try {
            // Atualiza o saldo na conta
            await ContaService.atualizarSaldo(obj.conta_id, obj.valor, obj.categoria.tipo.id, transaction);

            // Verificar se existe orçamento
            const orcamentoId = await OrcamentoService.findByPeriodAndCategory(obj.data, obj.categoria_id);

            // Se existir orçamento: Atualizar valor disponivel
            if (orcamentoId !== null) {
                const limiteCategoria = await OrcamentoService.atualizarValorUtilizado(
                    orcamentoId,
                    obj.categoria.id,
                    obj.valor,
                    transaction
                );

                return `Você ainda pode utilizar R$ ${limiteCategoria} para essa categoria.`;
            }

            // Retornar orçamento e valor disponivel
            return "Não existe orçamento cadastrado para o período e categoria!";
        } catch (error) {
            console.error("Erro ao aplicar regras de negócio da transação:", error);
            throw error;
        }
    }
}

export { TransacaoService };

import { Transacao } from "../models/Transacao.js";
import { ContaService } from "./ContaService.js";
import { OrcamentoService } from "./OrcamentoService.js";
import { MessageResponseDTO } from "../dto/response/MessageResponseDTO.js";

class TransacaoService {
  static async findAll() {
    const objs = await Transacao.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Transacao.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { data, descricao, valor, conta, categoria, favorecido } = req.body;

    if (conta == null) throw 'A conta utilizada nessa transação deve ser informada';
    if (categoria == null) throw 'A categoria a qual essa transação pertence deve ser informada';
    if (favorecido == null) throw 'Deve ser informado o participante dessa transação';

    // Normaliza o valor recebido
    const valorNormalizado = Math.abs(valor);

    const t = await Transacao.sequelize.transaction();

    try {
      const obj = await Transacao.create(
        {
          data,
          descricao,
          valor: valorNormalizado,
          contaId: conta.id,
          categoriaId: categoria.id,
          favorecidoId: favorecido.id
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
  }

  static async update(req){

  }

  static async delete(req){
    
  }

  static async regrasDeNegocio(obj, transaction) {
    // Atualiza o saldo na conta
    await ContaService.atualizarSaldo(obj.contaId, obj.valor, obj.categoria.tipo.id, transaction);

    // Verificar se existe orçamento
    const orcamentoId = await OrcamentoService.findByPeriodAndCategory(obj.data, obj.categoriaId);

    // Se existir orçamento: Atualizar valor disponivel
    if (orcamentoId != null) {
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
  }
}

export { TransacaoService };
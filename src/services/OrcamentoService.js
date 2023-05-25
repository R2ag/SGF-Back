import { Sequelize } from "sequelize";
import { Orcamento } from "../models/Orcamento.js";
import { OrcamentoCategoria } from "../models/OrcamentoCategoria.js";

class OrcamentoService {
  static async findAll() {
    const objs = await Orcamento.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Orcamento.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async findByPeriodAndCategory(data, categoriaId) {
    const orcamentoId = await Orcamento.sequelize.query(
      "SELECT id FROM orcamentos JOIN orcamentosCategorias ON orcamentos.id = orcamentosCategorias.orcamentoId WHERE orcamentos.dataInicio <= :data AND orcamentos.dataFinal >= :data AND orcamentosCategorias.categoriaId = :categoriaId",
      { replacements: { data: data, categoriaId: categoriaId }, type: Sequelize.QueryTypes.SELECT }
    );

    return orcamentoId;
  }

  static async atualizarValorUtilizado(idOrcamento, idCategoria, valorTransacao, transaction) {
    const orcamentoCategoria = await OrcamentoCategoria.findOne({
      where: {
        orcamentoId: idOrcamento,
        categoriaId: idCategoria
      }
    });

    if (!orcamentoCategoria) {
      throw new Error('Não foi possível localizar a categoria informada no orçamento!');
    }

    orcamentoCategoria.valorUtilizado += valorTransacao;
    await orcamentoCategoria.save(transaction);

    return (orcamentoCategoria.valor - orcamentoCategoria.valorUtilizado);
  }
}

export { OrcamentoService };
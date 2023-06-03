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
        } catch (error) {
            console.error("Erro ao criar transação:", error);
            throw error;
        }
    }

    static async update(req) {
        try {

            const t = await Transacao.sequelize.transaction();

            const { id } = req.params;
            const { data, descricao, valor, conta, categoria, favorecido } = req.body;

            const valorNormalizado = Math.abs(valor);

            const obj = await Transacao.findByPk(id, { include: { all: true, nested: true }, transaction: t });

            //Atualizar o saldo da conta
            if ((obj.valor != valor) || (obj.categoria.tipo.id != categoria.tipo.id) || (obj.conta.id != conta.id)){
                //Desfaz a alteração no saldo feita no create
                if (obj.categoria.tipo.id == 1) {
                    await ContaService.atualizarSaldo(obj.contaId, obj.valor, 2, t);
                } else {
                    await ContaService.atualizarSaldo(obj.contaId, obj.valor, 1, t);
                }

                //Realiza as alterações;
                Object.assign(obj, {
                    data,
                    descricao,
                    valor: valorNormalizado,
                    contaId: conta.id,
                    categoriaId: categoria.id,
                    favorecidoId: favorecido.id
                })
                await obj.save(t);

                //Aplica as regras de negocio sobre a alteração.
                const objCriado = await Transacao.findByPk(obj.id, { include: { all: true, nested: true }, transaction: t });

                const messageResponse = new MessageResponseDTO(await this.regrasDeNegocio(objCriado, t));

                await t.commit();

                return messageResponse;

            }else{
                Object.assign(obj, {
                    data,
                    descricao,
                    valor: valor,
                    contaId: conta.id,
                    categoriaId: categoria.id,
                    favorecidoId: favorecido.id
                })
                await obj.save(t);
                const messageResponse = new MessageResponseDTO("Transação atualizada com sucesso!");

                await t.commit();

                return messageResponse;
            }
        } catch (error) {
            console.error("Erro ao atualizar a transação", error);
            throw error;
        }

    }

    static async delete(req) {
        try {
            const { id } = req.params;
            const t = await Transacao.sequelize.transaction();

            const obj = await Transacao.findByPk(id, { include: { all: true, nested: true }, transaction: t });;

            
            if (obj == null) throw 'Transação não encontrada';

            if (obj.categoria.tipo.id == 1) {
                await ContaService.atualizarSaldo(obj.contaId, obj.valor, 2, t);
            } else {
                await ContaService.atualizarSaldo(obj.contaId, obj.valor, 1, t);
            }
            await obj.destroy(t);

            t.commit();

            return obj;
        } catch (error) {
            console.error("Erro ao excluir a transação", error);
            throw error;
        }
    }
    static async regrasDeNegocio(obj, transaction) {
        try {
            // Atualiza o saldo na conta
            await ContaService.atualizarSaldo(obj.contaId, obj.valor, obj.categoria.tipo.id, transaction);
    
            // Verificar se existe orçamento
            const orcamentosId = await OrcamentoService.findByPeriodAndCategory(obj.data, obj.categoriaId);
    
            // Se existir orçamento: Atualizar valor disponível
            if (orcamentosId.length > 0) {
                let mensagem = '';
                await Promise.all(orcamentosId.map(async (orcamento) => {
                    const orcamentoId = orcamento.id; // Acessando corretamente o valor do orcamentoId
                    const limiteDisponivel = await OrcamentoService.atualizarValorUtilizado(
                        orcamentoId,
                        obj.categoriaId,
                        obj.valor,
                        transaction
                    );
                    mensagem = mensagem.concat(`Você ainda pode utilizar R$ ${limiteDisponivel} para essa categoria no orçamento ${orcamentoId}. `);
                }));
    
                return mensagem;
            }
    
            // Retornar mensagem de que não existe orçamento cadastrado para o período e categoria
            return "Não existe orçamento cadastrado para o período e categoria!";
        } catch (error) {
            console.error("Erro ao aplicar regras de negócio da transação:", error);
            throw error;
        }
    }

    static async fyndByCategoriaEPeriodo(req){
        const {idCategoria, dataInicial, dataFinal} = req.params;
        
        objs = await Transacao.sequelize.query(`
            SELECT
                transacoes.data AS 'Data',
                transacoes.valor AS 'Valor',
                contas.nome AS 'Conta',
                favorecidos.nome AS 'Favorecido',
                transacoes.descricao AS 'Descricao'
            FROM
                transacoes
                JOIN contas ON transacoes.conta_id = contas.id
                JOIN favorecidos ON transacoes.favorecido_id = favorecidos.id
            WHERE
                categorias.id = :categoria AND 
                transacoes.data <= :data_inicial AND 
                transacoes.data >= :data_final
        `, {replacements: {categoria: idCategoria, data_inicial: dataInicial, data_final: dataFinal}, type: QueryTypes.SELECT});

        return objs;
    }

    static async fyndByContaEPeriodo(req){
        const {idConta, dataInicial, dataFinal} = req.params;
        
        objs = await Transacao.sequelize.query(`
            SELECT
                transacoes.data AS 'Data',
                transacoes.valor AS 'Valor',
                categorias.nome AS 'Categoria',
                favorecidos.nome AS 'Favorecido',
                transacoes.descricao AS 'Descricao'
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                JOIN favorecidos ON transacoes.favorecido_id = favorecidos.id
            WHERE
                contas.id = :conta AND 
                transacoes.data <= :data_inicial AND 
                transacoes.data >= :data_final
        `, {replacements: {conta: idConta, data_inicial: dataInicial, data_final: dataFinal}, type: QueryTypes.SELECT});

        return objs;
    }

    static async fyndByFavirecidoEPeriodo(req){
        const {idFavorecido, dataInicial, dataFinal} = req.params;
        
        objs = await Transacao.sequelize.query(`
            SELECT
                transacoes.data AS 'Data',
                transacoes.valor AS 'Valor',
                categorias.nome AS 'Categoria',
                contas.nome AS 'Conta',
                transacoes.descricao AS 'Descricao'
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                JOIN contas ON transacoes.conta_id = contas.id
            WHERE
                favorecidos.id = :favorecido AND 
                transacoes.data <= :data_inicial AND 
                transacoes.data >= :data_final
        `, {replacements: {favorecido: idFavorecido, data_inicial: dataInicial, data_final: dataFinal}, type: QueryTypes.SELECT});

        return objs;
    }

    static async listByCategoriaEPeriodo(req){
        const {dataInicial, dataFinal} = req.params;
        
        objs = await Transacao.sequelize.query(`
            SELECT
                contas.nome AS 'Conta',
                SUM(transacoes.valor) AS 'Valor'
            FROM
                transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
            WHERE 
                transacoes.data <= :data_inicial AND 
                transacoes.data >= :data_final
            GROUP BY
                contas.nome
        `, {replacements: {data_inicial: dataInicial, data_final: dataFinal}, type: QueryTypes.SELECT});

        return objs;
    }


}

export { TransacaoService };

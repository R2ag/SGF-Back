import { Sequelize } from "sequelize";
import {Transacao} from "../models/Transacao.js";
import { ContaService } from "./ContaService.js";
import { OrcamentoService } from "./OrcamentoService.js";

class TransacaoService{
    static async findAll(){
        const objs = await Transacao.findAll({include: {all: true, nested:true}});
        return objs;
    }

    static async findByPk(req){
        const {id} = req.params;
        const obj = await Transacao.findByPk(id, {include: {all: true, nested: true}});
        return obj; 
    }

    static async create(req){
        const {data, descricao, valor, conta, categoria, favorecido } = req.body;
        
        if (conta == null) throw 'A conta utilizada nessa transação deve ser informada';

        if(categoria == null) throw 'A categoria a qual essa transação pertence deve ser informada';

        if(favorecido == null) throw 'Deve ser informado o participante dessa transação'

        //Normaliza o valor recebido
        valor = Math.abs(valor);
        
        const t = await Sequelize.transaction();

        try{
            const obj = await Transacao.create({data, descricao, valor, contaId: conta.id, categoriaId: categoria.id, favorecidoId: favorecido.id}, {transaction: t});
            
            const objCriado = await Transacao.findByPk(obj.id, {include: {all: true, nested: true}}, {transaction: t});

            const messageResponse = new MessageResponseDTO(await this.regrasDeNegocio(objCriado, t))

            await t.commit();

            return messageResponse;
        }catch{
            
            await t.rollback();
            throw "Erro ao cirar a Transação.";
        }
        
    }

    static async update(req){

    }

    static async delete(req){

    }


    static async regrasDeNegocio(obj, transaction ){
        await ContaService.atualizarSaldo(obj.contaId, obj.valor, obj.categoria.tipo.id, transaction);
        //veriicar se existe orçamento
        const orcamentoId = OrcamentoService.findByPeriodAndCategory(obj.data, obj.categoriaId);
        
        //se existir orçamento: Atualizar valor disponivel
        if (orcamentoId != null){
            
        }
        //retornar orçamento e valor disponivel
  
    }

}

export {TransacaoService}
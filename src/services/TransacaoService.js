import {Transacao} from "../models/Transacao.js";

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


        
        const obj = await Transacao.create({data, descricao, valor, contaId: conta.id, categoriaId: categoria.id, favorecidoId: favorecido.id});

        return await this.regrasDeNegocio(await Transacao.findByP(obj.id, {include: {all: true, nested: true}}));
    }

    static async update(req){

    }

    static async delete(req){

    }


    static async regrasDeNegocio(obj){
        //atualizar saldo
        //veriicar se existe orçamento 
    }

}

export {TransacaoService}
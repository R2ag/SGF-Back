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
        //atualizar saldo
        
        
    }

    static async update(req){

    }

    static async delete(req){

    }
}

export {TransacaoService}
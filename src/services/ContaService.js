import {Conta} from "../models/Conta.js";

class ContaService{

    static async findAll(){
        const objs = await Conta.findAll({include: {all: true, nested:true}});
        return objs;
    }

    static async findByPk(req){
        const {id} = req.params;
        const obj = await Conta.findByPk(id, {include: {all: true, nested: true}});
        return obj;
    }

    static async create(req){
        const {nome, tipo, descicao, saldo, usuario} = req.body;
        const obj = await Conta.create({nome, tipo, descicao, saldo, usuarioId: usuario.id});
        return await Conta.findByPk(obj.id, {include: {all: true, nested: true}});

    }

    static async update(req){
        const {id} = req.params;
        const {nome, tipo, descicao, saldo, usuario} = req.body;
        const obj = await Conta.findByPk(id, {include: {all: true, nested: true}});
        if (obj == null) throw 'Conta Não Encontrada.';
        Object.assign(obj, {nome, tipo, descicao, saldo, usuarioId: usuario.id});
        return await obj.save;
    }

    static async delete(req){
        const {id} = req.params;
        const obj =  await Conta.findByPk(id);
        if(obj == null) throw 'Conta Não Encontrada';
        try{
            await obj.destroy();
            return obj;
        }catch(error){
            throw 'Não é possivel excluir uma conta que esteja em uso.';
        }
    }
}

export {ContaService};